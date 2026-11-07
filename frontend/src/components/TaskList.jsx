function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          className={`task-item ${task.done ? "task-completed" : ""}`}
          key={task.id}
        >
          <div className="task-details">
            <div className={task.done ? "task-check checked" : "task-check"}>
              {task.done ? "✓" : "○"}
            </div>

            <div className="task-content">
              <span className={task.done ? "completed" : "task-title"}>
                {task.title}
              </span>

              <small>{task.done ? "Completed" : "Pending"}</small>
            </div>
          </div>

          <div className="task-actions">
            <button className="complete-btn" onClick={() => onToggle(task.id)}>
              {task.done ? "Undo" : "Complete"}
            </button>

            <button className="delete-btn" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
