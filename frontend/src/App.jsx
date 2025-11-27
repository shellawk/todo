import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Stats from './components/Stats';
import { todoAPI, healthCheck, getDBInfo } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [dbInfo, setDbInfo] = useState(null);
  const [error, setError] = useState(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoAPI.getAllTodos();
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Check server health
  const checkServerHealth = async () => {
    try {
      const health = await healthCheck();
      setServerStatus(health.database);
      
      // If server is healthy, fetch DB info
      if (health.database === 'connected') {
        const dbInfoData = await getDBInfo();
        setDbInfo(dbInfoData);
      }
    } catch (error) {
      setServerStatus('disconnected');
      setError('Cannot connect to server. Please make sure the backend is running.');
    }
  };

  // Add new todo
  const addTodo = async (title) => {
    try {
      setAdding(true);
      setError(null);
      const newTodo = await todoAPI.createTodo({ title });
      setTodos(prevTodos => [newTodo, ...prevTodos]);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
      throw error;
    } finally {
      setAdding(false);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      setError(null);
      const updatedTodo = await todoAPI.toggleTodo(id, completed);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo._id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  // Update todo title
  const updateTodo = async (id, title) => {
    try {
      setError(null);
      const updatedTodo = await todoAPI.updateTodo(id, { title });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo._id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
      throw error;
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      setError(null);
      await todoAPI.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  // Initial data loading
  useEffect(() => {
    checkServerHealth();
    fetchTodos();

    // Set up periodic health checks
    const healthInterval = setInterval(checkServerHealth, 30000); // Check every 30 seconds

    return () => clearInterval(healthInterval);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>📝 Todo App</h1>
          <p>MongoDB + Node.js + React + Vite</p>
          
          <div className={`server-status ${serverStatus}`}>
            <span className="status-dot"></span>
            Server: {serverStatus}
            {dbInfo && (
              <span className="db-name"> | DB: {dbInfo.database}</span>
            )}
          </div>
        </header>

        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="dismiss-btn">×</button>
          </div>
        )}

        <TodoForm onAddTodo={addTodo} loading={adding} />
        
        <Stats todos={todos} dbInfo={dbInfo} />
        
        <TodoList
          todos={todos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onUpdateTodo={updateTodo}
          loading={loading}
        />

        <footer className="app-footer">
          <p>
            Total items in database: {dbInfo?.stats?.objects || 0} | 
            Built with MongoDB, Express, React, Node.js + Vite
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;