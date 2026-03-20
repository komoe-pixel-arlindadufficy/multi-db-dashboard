import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { DBManager } from './dbManager.ts';
import { sendReportEmail } from './emailService.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      const health = await DBManager.checkHealth();
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/reports', async (req, res) => {
    try {
      // Mocking merged data since we don't have real DBs in the sandbox
      // In a real scenario, you'd query each DB and merge the results
      const mockData = [
        { id: 1, source: 'MSSQL', customer: 'Acme Corp', amount: 1200, status: 'Completed', date: '2024-03-15' },
        { id: 2, source: 'MySQL', customer: 'Globex', amount: 850, status: 'Pending', date: '2024-03-16' },
        { id: 3, source: 'PostgreSQL', customer: 'Soylent Corp', amount: 2300, status: 'Completed', date: '2024-03-17' },
        { id: 4, source: 'MSSQL', customer: 'Initech', amount: 450, status: 'Completed', date: '2024-03-18' },
        { id: 5, source: 'MySQL', customer: 'Umbrella Corp', amount: 3100, status: 'Failed', date: '2024-03-19' },
      ];
      res.json(mockData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/send-report', async (req, res) => {
    try {
      const { health, reports } = req.body;
      await sendReportEmail({ health, reports });
      res.json({ message: 'Report sent successfully' });
    } catch (error: any) {
      console.error('Email error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
