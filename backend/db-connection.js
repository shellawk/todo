const mongoose = require('mongoose');

const maxRetries = 5;
let retryCount = 0;

const connectWithRetry = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/to-do?authSource=admin';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    retryCount = 0; // Reset retry count on successful connection
    
  } catch (error) {
    retryCount++;
    console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error.message);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying connection in 5 seconds... (${retryCount}/${maxRetries})`);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error('💥 Max retries reached. Exiting application.');
      process.exit(1);
    }
  }
};

// Connection events
mongoose.connection.on('disconnected', () => {
  console.log('📊 MongoDB disconnected');
  if (retryCount < maxRetries) {
    console.log('🔄 Attempting to reconnect...');
    connectWithRetry();
  }
});

mongoose.connection.on('error', (error) => {
  console.error('📊 MongoDB error:', error);
});

module.exports = connectWithRetry;