import TodoItem from './TodoItem';

const TodoList = ({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo, 
  onUpdateTodo,
  loading 
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No todos yet!</h3>
        <p>Add a new todo above to get started.</p>
      </div>
    );
  }

  // Separate completed and active todos
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todo-list-container">
      {activeTodos.length > 0 && (
        <div className="todo-section">
          <h3>Active Todos ({activeTodos.length})</h3>
          <div className="todo-list">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
                onUpdate={onUpdateTodo}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div className="todo-section">
          <h3>Completed Todos ({completedTodos.length})</h3>
          <div className="todo-list completed-list">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
                onUpdate={onUpdateTodo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;