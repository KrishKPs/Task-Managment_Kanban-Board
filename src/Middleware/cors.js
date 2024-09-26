import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  origin: '*',  // Allow all origins for testing; replace with your domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE' , 'OPTIONS'],  // Allow all necessary HTTP methods
  credentials: true,  // Allow credentials
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],  // Allow headers
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
