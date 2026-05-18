import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 SmartLeads API running on http://localhost:${PORT}`);
    console.log(`📖 Environment: ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`\nEndpoints:`);
    console.log(`  POST   /api/auth/register`);
    console.log(`  POST   /api/auth/login`);
    console.log(`  GET    /api/auth/me`);
    console.log(`  GET    /api/leads`);
    console.log(`  POST   /api/leads`);
    console.log(`  GET    /api/leads/stats`);
    console.log(`  GET    /api/leads/export`);
    console.log(`  GET    /api/leads/:id`);
    console.log(`  PUT    /api/leads/:id`);
    console.log(`  DELETE /api/leads/:id\n`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
