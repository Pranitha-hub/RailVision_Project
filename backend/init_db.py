import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
import time

def create_db():
    print("Connecting to default postgres db...")
    try:
        conn = psycopg2.connect(
            user="postgres",
            password="270806",
            host="localhost",
            port="5432"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'railvision_db'")
        exists = cur.fetchone()
        if not exists:
            cur.execute("CREATE DATABASE railvision_db")
            print("Database railvision_db created.")
        else:
            print("Database railvision_db already exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error creating db: {e}")

if __name__ == "__main__":
    create_db()
