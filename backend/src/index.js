import express from 'express';
import cors from 'cors';

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

const HOTSPOT_CACHE = {
  date: null,
  payload: null,
  updatedAt: null,
};

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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchPolymarketTop(limit = 3) {
  try {
    const url =
      `https://gamma-api.polymarket.com/markets?active=true&closed=false&archived=false&limit=${Math.max(limit * 3, 20)}&offset=0`;
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Polymarket status ${res.status}`);
    const rows = await res.json();

    const sorted = [...rows]
      .sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0))
      .slice(0, limit)
      .map((m) => ({
        title: m.question || m.title || 'Unknown topic',
        source: 'Polymarket',
        url: m.slug ? `https://polymarket.com/event/${m.slug}` : 'https://polymarket.com',
      }));

    return sorted;
  } catch (err) {
    console.error('fetchPolymarketTop failed:', err.message);
    return Array.from({ length: limit }).map((_, i) => ({
      title: `Polymarket trend unavailable #${i + 1}`,
      source: 'Polymarket',
      url: 'https://polymarket.com',
    }));
  }
}

async function fetchChineseTop3() {
  try {
    // Weibo hot search list as practical "微热点" source
    const url = 'https://weibo.com/ajax/side/hotSearch';
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
      },
    });
    if (!res.ok) throw new Error(`Weibo status ${res.status}`);
    const data = await res.json();

    const list = (data?.data?.realtime || [])
      .slice(0, 3)
      .map((x) => ({
        title: x.note || x.word || '未知热点',
        source: '微热点',
        url: x.word ? `https://s.weibo.com/weibo?q=${encodeURIComponent(x.word)}` : 'https://weibo.com',
      }));

    if (list.length < 3) throw new Error('insufficient chinese topics');
    return list;
  } catch (err) {
    console.error('fetchChineseTop3 failed:', err.message);
    return [
      { title: '微热点暂不可用 #1', source: '微热点', url: 'https://weibo.com' },
      { title: '微热点暂不可用 #2', source: '微热点', url: 'https://weibo.com' },
      { title: '微热点暂不可用 #3', source: '微热点', url: 'https://weibo.com' },
    ];
  }
}

async function buildHotspots() {
  // Fast-track mode: use Polymarket English hotspots for both sections.
  const enTop6 = await fetchPolymarketTop(6);
  const enTop3 = enTop6.slice(0, 3);
  const zhTop3 = enTop6.slice(3, 6);

  return {
    date: todayKey(),
    updatedAt: new Date().toISOString(),
    english: enTop3,
    chinese: zhTop3,
    all: [...enTop3, ...zhTop3],
  };
}

async function getDailyHotspots() {
  const currentDay = todayKey();
  if (HOTSPOT_CACHE.payload && HOTSPOT_CACHE.date === currentDay) {
    return HOTSPOT_CACHE.payload;
  }

  const payload = await buildHotspots();
  HOTSPOT_CACHE.date = currentDay;
  HOTSPOT_CACHE.payload = payload;
  HOTSPOT_CACHE.updatedAt = payload.updatedAt;
  return payload;
}

// Background refresh check every hour; only refreshes on date change.
setInterval(async () => {
  const currentDay = todayKey();
  if (HOTSPOT_CACHE.date !== currentDay) {
    HOTSPOT_CACHE.payload = await buildHotspots();
    HOTSPOT_CACHE.date = currentDay;
    HOTSPOT_CACHE.updatedAt = HOTSPOT_CACHE.payload.updatedAt;
  }
}, 60 * 60 * 1000);

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
    version: '1.1.0',
    endpoints: ['/health', '/auth/login', '/hotspots/daily'],
  });
});

app.get('/hotspots/daily', async (req, res) => {
  try {
    const payload = await getDailyHotspots();
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Failed to build hotspots', detail: err.message });
  }
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
