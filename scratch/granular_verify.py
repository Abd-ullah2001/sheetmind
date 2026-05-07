import os
import sys
import time

print("Starting granular verification...")

if os.path.exists("backend"):
    os.chdir("backend")
sys.path.insert(0, ".")

def test_import(module_name):
    print(f"Testing import of {module_name}...")
    start = time.time()
    try:
        __import__(module_name)
        print(f"  SUCCESS: {module_name} imported in {time.time() - start:.2f}s")
    except Exception as e:
        print(f"  FAILURE: {module_name} failed. Error: {e}")
        import traceback
        traceback.print_exc()

modules = [
    "app.config",
    "app.database",
    "app.redis_client",
    "app.services.log_service",
    "app.services.agent_service",
    "app.routers.health",
    "app.routers.auth",
    "app.routers.files",
    "app.routers.sheets",
    "app.routers.agent",
    "app.routers.webhooks",
    "app.routers.logs",
    "app.main"
]

for m in modules:
    test_import(m)
