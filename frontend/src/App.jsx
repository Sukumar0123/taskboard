import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);

  async function fetchTasks() {
    const response = await fetch(API);
    const data = await response.json();
    setTasks(data);
  }

  async function addTask(title) {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    fetchTasks();
  }

  async function toggleTask(id) {
    await fetch(`${API}/${id}`, { method: "PUT" });
    fetchTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <Header />

      <main className="container">
        <h2>My Tasks</h2>

        <TaskForm onAddTask={addTask} />

        <p>Total Tasks: {tasks.length}</p>

        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </main>
    </div>
  );
}

export default App;
