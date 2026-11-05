function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-item" key={task.id}>
          <span className={task.done ? "completed" : ""}>{task.title}</span>

          <div>
            <button onClick={() => onToggle(task.id)}>
              {task.done ? "Undo" : "Complete"}
            </button>

            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
