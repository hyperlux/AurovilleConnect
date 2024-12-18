module.exports = {
  port: process.env.PORT || 5000,
  cors: {
    origin: ['https://auroville.social', 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  security: {
    rateLimiting: true,
    maxRequests: 100,
    timeWindow: 15 * 60 * 1000 // 15 minutes
  },
  db: {
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/auroville"
  }
};
