import { useState } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editText.trim() && editText !== todo.title) {
      await onUpdate(todo._id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, todo.completed)}
          className="todo-checkbox"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <span 
            className="todo-text"
            onDoubleClick={handleEdit}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="edit-btn"
            aria-label={`Edit "${todo.title}"`}
            type="button"
          >
            ✏️
          </button>
        )}
        
        <button
          onClick={() => onDelete(todo._id)}
          className="delete-btn"
          aria-label={`Delete "${todo.title}"`}
          type="button"
        >
          🗑️
        </button>
      </div>

      <div className="todo-meta">
        <small className="todo-date">
          Created: {new Date(todo.createdAt).toLocaleDateString()}
        </small>
        <small className="todo-id">
          ID: {todo._id?.substring(0, 8)}...
        </small>
      </div>
    </div>
  );
};

export default TodoItem;