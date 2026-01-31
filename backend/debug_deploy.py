import os
import sys
import django
from pathlib import Path

# Add the project root to the python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Use production settings by default, but allow override
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crowdbank.settings.production')

try:
    django.setup()
    print("✅ Django setup successful.")
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    sys.exit(1)

from django.conf import settings
from django.db import connections, OperationalError
from django.core.cache import cache
from django.contrib.auth import get_user_model

def check_env():
    print("\n--- Environment Check ---")
    required_vars = [
        'DJANGO_SECRET_KEY', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD',
        'POSTGRES_HOST', 'REDIS_HOST'
    ]
    all_present = True
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            print(f"❌ Missing environment variable: {var}")
            all_present = False
        else:
            masked = value[:2] + '****' if 'PASSWORD' in var or 'KEY' in var else value
            print(f"✅ {var} is set: {masked}")
    
    if all_present:
        print("✅ All required environment variables appear to be set.")

def check_db():
    print("\n--- Database Check ---")
    db_conn = connections['default']
    try:
        db_conn.cursor()
        print("✅ Database connection successful.")
    except OperationalError as e:
        print(f"❌ Database connection failed: {e}")
        return

    # Check for unapplied migrations
    from django.db.migrations.executor import MigrationExecutor
    try:
        executor = MigrationExecutor(db_conn)
        targets = executor.loader.graph.leaf_nodes()
        if executor.migration_plan(targets):
            print("⚠️  Warning: There are unapplied migrations.")
        else:
            print("✅ All migrations are applied.")
    except Exception as e:
        print(f"❌ Failed to check migrations: {e}")

def check_redis():
    print("\n--- Redis Check (Cache) ---")
    try:
        cache.set('debug_test_key', 'test_value', timeout=30)
        value = cache.get('debug_test_key')
        if value == 'test_value':
            print("✅ Redis connection and cache write/read successful.")
        else:
            print(f"❌ Redis write succeeded but read returned: {value}")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")

def check_presence_middleware_requirements():
    print("\n--- Presence Middleware Dependencies ---")
    # PresenceMiddleware uses cache, so if Redis is down, it might look like a 500 loop
    # or timeout if not handled gracefully.
    print(f"Cache Backend: {settings.CACHES['default']['BACKEND']}")
    print(f"Redis URL: {os.getenv('REDIS_URL', 'Not Set')}")

def manual_login_check():
    print("\n--- Manual Login Check ---")
    username = input("Enter username to test login (or press Enter to skip): ").strip()
    if not username:
        return
    
    User = get_user_model()
    try:
        user = User.objects.get(username=username)
        print(f"✅ User found: {user.username} (ID: {user.id})")
        if not user.is_active:
            print("⚠️  User is inactive.")
        
        # We can't easily check password without knowing it, 
        # but we can check if the model is loadable.
    except User.DoesNotExist:
        print(f"❌ User '{username}' not found.")
    except Exception as e:
        print(f"❌ Error querying user: {e}")

if __name__ == "__main__":
    print(f"Running diagnostics using settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    check_env()
    check_db()
    check_redis()
    check_presence_middleware_requirements()
    # manual_login_check() # Skip interactive part for automation
    print("\n✅ Diagnostics finished.")
