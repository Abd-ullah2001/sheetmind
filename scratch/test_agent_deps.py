import time
import sys

def test_import(module_name):
    print(f"Testing import of {module_name}...")
    start = time.time()
    try:
        __import__(module_name)
        print(f"  SUCCESS: {module_name} imported in {time.time() - start:.2f}s")
    except Exception as e:
        print(f"  FAILURE: {module_name} failed. Error: {e}")

test_import("langchain_openai")
test_import("langgraph.prebuilt")
