import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USERS = [
  {
    id: '1',
    email: 'shaoshixiong@gmail.com',
    name: 'Orion',
    role: 'admin',
    walletAddress: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'mark@locatechs.com',
    name: 'Mark',
    role: 'admin',
    walletAddress: null,
    createdAt: new Date().toISOString(),
  },
];

const generateToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

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
    endpoints: ['/health', '/auth/login'],
  });
});

app.post('/auth/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = ADMIN_USERS.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  const { password, ...userWithoutPassword } = user;

  res.json({
    token,
    user: userWithoutPassword,
  });
});

app.listen(PORT, () => {
  console.log(`B1 backend running on port ${PORT}`);
});
