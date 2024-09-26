// src/middleware/cors.js
import Cors from 'cors';

// CORS middleware to allow requests from specific domains
const cors = Cors({
  origin: ['https://task-managment-kanban-mmhesu1y6-krish-patels-projects-3e6b9326.vercel.app'],  // Add other origins as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE' , 'OPTIONS'],
  credentials : true,     // Allow 'Access-Control-Allow-Credentials'  
  allowedHeaders : ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
});

// Helper function to run the middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
