import os
import sys

# Set encoding for Windows terminal
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

print("--- STARTING COMPREHENSIVE BACKEND VERIFICATION ---")

def test_imports():
    print("[1/3] Verifying Module Imports...")
    modules = [
        "app.main",
        "app.config",
        "app.database",
        "app.services.auth_service",
        "app.services.s3_service",
        "app.services.agent_service",
        "app.routers.auth",
        "app.routers.files",
        "app.routers.sheets",
        "app.routers.agent"
    ]
    all_ok = True
    for mod in modules:
        try:
            __import__(mod)
            print(f"  OK: {mod} imported successfully")
        except Exception as e:
            print(f"  ERROR: {mod} failed: {e}")
            all_ok = False
    return all_ok

def test_config():
    print("\n[2/3] Verifying Configuration...")
    try:
        from app.config import get_settings
        settings = get_settings()
        print(f"  OK: Config loaded (Environment: {settings.app_env})")
        
        # Check critical keys
        critical_keys = [
            "supabase_url", "aws_s3_bucket_name", "nvidia_api_key", "jwt_secret"
        ]
        all_ok = True
        for key in critical_keys:
            val = getattr(settings, key)
            if val:
                print(f"  OK: {key} is set")
            else:
                print(f"  MISSING: {key} is EMPTY")
                all_ok = False
        return all_ok
    except Exception as e:
        print(f"  ERROR: Config verification failed: {e}")
        return False

def test_app_initialization():
    print("\n[3/3] Verifying FastAPI App Initialization...")
    try:
        from fastapi.testclient import TestClient
        from app.main import app
        client = TestClient(app)
        response = client.get("/api/v1/health")
        if response.status_code == 200:
            print(f"  OK: Health check passed: {response.json()}")
            return True
        else:
            print(f"  ERROR: Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"  ERROR: App initialization failed: {e}")
        return False

if __name__ == "__main__":
    success_imports = test_imports()
    success_config = test_config()
    success_app = test_app_initialization()
    
    print("\n--- VERIFICATION SUMMARY ---")
    if success_imports and success_config and success_app:
        print("RESULT: SUCCESS - The backend is fully operational.")
        sys.exit(0)
    else:
        print("RESULT: FAILURE - Issues found in backend.")
        sys.exit(1)
