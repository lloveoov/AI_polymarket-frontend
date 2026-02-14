import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://ai-polymarket-frontend.vercel.app',
    /^https:\/\/ai-polymarket-frontend-.*\.vercel\.app$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'b1-backend',
    ts: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'b1-backend',
    version: '1.0.0',
    endpoints: ['/health'],
  });
});

app.listen(PORT, () => {
  console.log(`B1 backend running on port ${PORT}`);
});
