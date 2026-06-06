import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load the backend .env explicitly so running nodemon from workspace root still picks it up
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
// Connect to MongoDB first, then start server
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown helper
    const shutdown = async (signal) => {
      try {
        console.log(`Shutting down server (signal: ${signal})...`);
        server.close(async () => {
          try {
            await mongoose.connection.close(false);
            console.log('MongoDB connection closed');
          } catch (e) {
            console.warn('Error closing MongoDB connection', e.message);
          }
          // If nodemon requested restart, re-raise the signal
          if (signal === 'SIGUSR2') {
            process.kill(process.pid, 'SIGUSR2');
          } else {
            process.exit(0);
          }
        });
      } catch (err) {
        console.error('Shutdown error', err.message);
        process.exit(1);
      }
    };

    process.once('SIGUSR2', () => shutdown('SIGUSR2'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
