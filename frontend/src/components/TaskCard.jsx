import React from 'react';

function TaskCard({ task, onToggle, onDelete, disabled }) {
  return (
    <article className={`task-card ${task.completed ? 'task-card--done' : ''}`}>
      <div className="task-card__meta">
        <p className="task-card__time">{new Date(task.createdAt).toLocaleString()}</p>
      </div>
      <h3>{task.title}</h3>
      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--ghost"
          disabled={disabled}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Mark Active' : 'Mark Done'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          disabled={disabled}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
