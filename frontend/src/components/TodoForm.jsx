import { useState } from 'react';

const TodoForm = ({ onAddTodo, loading }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await onAddTodo(title.trim());
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          disabled={loading}
          maxLength={100}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={!title.trim() || loading}
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
      <div className="input-hint">
        {title.length}/100 characters
      </div>
    </form>
  );
};

export default TodoForm;