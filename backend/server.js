const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    
    // Remove the deprecated options
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    
    // Log all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database first, then start server
connectDB().then(() => {
  // Routes
  app.use('/api/todos', require('./routes/todos'));
  
  // Health check with DB status
  app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      message: 'Server is running!',
      database: statusText[dbStatus],
      timestamp: new Date().toISOString()
    });
  });

  // Database info endpoint
  app.get('/api/db-info', async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const stats = await db.stats();
      const collections = await db.listCollections().toArray();
      
      res.json({
        database: db.databaseName,
        collections: collections.map(c => c.name),
        stats: {
          collections: stats.collections,
          objects: stats.objects,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 Database info: http://localhost:${PORT}/api/db-info`);
  });
});