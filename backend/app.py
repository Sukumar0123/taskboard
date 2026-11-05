
import os
import time

import pymysql
from flask import Flask, jsonify, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
CORS(app)

# Exposes application metrics at /metrics
PrometheusMetrics(app)


def get_conn():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3307")),
        user=os.getenv("DB_USER", "taskuser"),
        password=os.getenv("DB_PASSWORD", "taskpass"),
        database=os.getenv("DB_NAME", "taskdb"),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
        connect_timeout=5,
    )


def init_db(retries=30):
    for attempt in range(retries):
        try:
            conn = get_conn()

            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS tasks (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        done BOOLEAN NOT NULL DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)

            conn.close()
            print("Database initialized successfully")
            return

        except pymysql.MySQLError as e:
            print(f"Waiting for MySQL: {e}")
            time.sleep(2)

    raise RuntimeError("Database not reachable")


if os.getenv("SKIP_DB_INIT") != "1":
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/ready")
def ready():
    try:
        conn = get_conn()
        conn.ping()
        conn.close()
        return {"status": "ready"}
    except Exception:
        return {"status": "db unavailable"}, 503


@app.get("/api/tasks")
def list_tasks():
    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, title, done FROM tasks ORDER BY id DESC"
        )
        rows = cur.fetchall()

    conn.close()
    return jsonify(rows)


@app.post("/api/tasks")
def add_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()

    if not title:
        return {"error": "title required"}, 400

    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO tasks (title) VALUES (%s)",
            (title,)
        )
        new_id = cur.lastrowid

    conn.close()

    return {
        "id": new_id,
        "title": title,
        "done": False
    }, 201


@app.put("/api/tasks/<int:task_id>")
def toggle_task(task_id):
    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(
            "UPDATE tasks SET done = NOT done WHERE id = %s",
            (task_id,)
        )

    conn.close()
    return {"id": task_id}


@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id):
    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM tasks WHERE id = %s",
            (task_id,)
        )

    conn.close()
    return "", 204


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
