import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function addTask(title) {
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Unable to add task");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Unable to update task");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete task");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.done;
    if (filter === "pending") return !task.done;
    return true;
  });

  return (
    <div className="app">
      <Header />

      <main className="container">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">WORKSPACE OVERVIEW</p>
            <h1>My Dashboard</h1>
            <p className="welcome-text">
              Organize your work and achieve your daily goals.
            </p>
          </div>

          <div className="date-card">
            <span>YOUR PROGRESS</span>
            <strong>{progress}%</strong>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card total-card">
            <div className="stat-icon">📋</div>
            <p>Total Tasks</p>
            <h2>{totalTasks}</h2>
            <span>All your tasks</span>
          </div>

          <div className="stat-card completed-card">
            <div className="stat-icon">✓</div>
            <p>Completed</p>
            <h2>{completedTasks}</h2>
            <span>Tasks finished</span>
          </div>

          <div className="stat-card pending-card">
            <div className="stat-icon">◷</div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
            <span>Tasks remaining</span>
          </div>
        </section>

        <section className="progress-card">
          <div className="progress-heading">
            <div>
              <h3>Overall Progress</h3>
              <p>Keep going! Every completed task counts.</p>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="progress-footer">
            <span>{completedTasks} completed</span>
            <span>{pendingTasks} remaining</span>
          </div>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">STAY PRODUCTIVE</p>
              <h2>Manage Your Tasks</h2>
            </div>

            <span className="task-count">
              {totalTasks} {totalTasks === 1 ? "Task" : "Tasks"}
            </span>
          </div>

          <div className="task-form-card">
            <h3>Add a New Task</h3>
            <TaskForm onAddTask={addTask} />
          </div>

          <div className="task-list-header">
            <h3>Your Tasks</h3>

            <div className="filter-buttons">
              {["all", "pending", "completed"].map((item) => (
                <button
                  key={item}
                  className={
                    filter === item ? "filter-btn active" : "filter-btn"
                  }
                  onClick={() => setFilter(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchTasks}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="empty-state">Loading your tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>{totalTasks === 0 ? "No tasks yet" : "No tasks found"}</h3>
              <p>
                {totalTasks === 0
                  ? "Add your first task and start being productive!"
                  : "Try another filter to see your tasks."}
              </p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        TaskBoard © 2026. Stay focused. Stay productive.
      </footer>
    </div>
  );
}

export default App;
