const Stats = ({ todos, dbInfo }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <span className="stat-number">{totalTodos}</span>
        </div>
        
        <div className="stat-card">
          <h3>Completed</h3>
          <span className="stat-number completed">{completedTodos}</span>
        </div>
        
        <div className="stat-card">
          <h3>Pending</h3>
          <span className="stat-number pending">{pendingTodos}</span>
        </div>
        
        <div className="stat-card">
          <h3>Progress</h3>
          <span className="stat-number">{completionPercentage}%</span>
        </div>
      </div>

      {dbInfo && (
        <div className="db-info">
          <h4>Database Info</h4>
          <div className="db-stats">
            <span>📊 Database: {dbInfo.database}</span>
            <span>📁 Collections: {dbInfo.collections?.length || 0}</span>
            <span>🗂️ Total Objects: {dbInfo.stats?.objects || 0}</span>
          </div>
        </div>
      )}

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Stats;