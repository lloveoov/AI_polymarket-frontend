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
  slotKey: null,
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

function amsterdamNowParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    hour: Number(get('hour') || 0),
    minute: Number(get('minute') || 0),
  };
}

function htmlDecode(input = '') {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function stripHtml(input = '') {
  return htmlDecode(input.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function shuffle(arr = []) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function inferCategory(board = '', title = '') {
  const text = `${board} ${title}`;
  if (/娱乐|影视|明星|综艺|音乐|电影|电视剧|偶像|粉丝|票房/i.test(text)) {
    return 'entertainment';
  }
  if (/科技|AI|人工智能|开发|程序|数码|芯片|开源|GitHub|机器学习|模型|技术/i.test(text)) {
    return 'tech';
  }
  return 'general';
}

function fallbackTopics(categoryLabel, count = 2) {
  return Array.from({ length: count }).map((_, i) => ({
    title: `${categoryLabel}热点抓取中 #${i + 1}`,
    url: 'https://tophub.today',
    source: 'TopHub',
    board: categoryLabel,
  }));
}

function parseTophubTopics(html) {
  const cardRegex = /<div class="cc-cd"[\s\S]*?<div class="cc-cd-lb">[\s\S]*?<span>\s*([^<]+?)\s*<\/span>[\s\S]*?<span class="cc-cd-sb-st">\s*([^<]+?)\s*<\/span>[\s\S]*?<div class="cc-cd-cb-l[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  const topicByCategory = { general: [], tech: [], entertainment: [] };

  let cardMatch;
  while ((cardMatch = cardRegex.exec(html)) !== null) {
    const boardName = stripHtml(cardMatch[1]);
    const boardSub = stripHtml(cardMatch[2]);
    const listHtml = cardMatch[3] || '';

    const itemRegex = /<a href="([^"]+)"[^>]*>[\s\S]*?<span class="t">([\s\S]*?)<\/span>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(listHtml)) !== null) {
      const url = htmlDecode(itemMatch[1]);
      const title = stripHtml(itemMatch[2]);
      if (!title || !url) continue;

      const category = inferCategory(`${boardName} ${boardSub}`, title);
      topicByCategory[category].push({
        title,
        url: url.startsWith('http') ? url : `https://tophub.today${url}`,
        source: 'TopHub',
        board: `${boardName} · ${boardSub}`,
      });
    }
  }

  return topicByCategory;
}

async function fetchTophubByCategory() {
  const res = await fetch('https://tophub.today', {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
    },
  });
  if (!res.ok) throw new Error(`TopHub status ${res.status}`);
  const html = await res.text();
  return parseTophubTopics(html);
}

function getCurrentSlotKey() {
  const now = amsterdamNowParts();
  if (now.hour >= 20) return `${now.dateKey}-20`;
  if (now.hour >= 8) return `${now.dateKey}-08`;
  return `${now.dateKey}-pre08`;
}

function shouldRunScheduleNow() {
  const now = amsterdamNowParts();
  const inMorningWindow = now.hour === 8 && now.minute <= 10;
  const inEveningWindow = now.hour === 20 && now.minute <= 10;
  return inMorningWindow || inEveningWindow;
}

async function buildHotspots() {
  let grouped = { general: [], tech: [], entertainment: [] };

  try {
    grouped = await fetchTophubByCategory();
  } catch (err) {
    console.error('fetchTophubByCategory failed:', err.message);
  }

  const general = shuffle(grouped.general).slice(0, 2);
  const tech = shuffle(grouped.tech).slice(0, 2);
  const entertainment = shuffle(grouped.entertainment).slice(0, 2);

  const normalized = {
    general: general.length ? general : fallbackTopics('综合', 2),
    tech: tech.length ? tech : fallbackTopics('科技', 2),
    entertainment: entertainment.length ? entertainment : fallbackTopics('娱乐', 2),
  };

  const all = [...normalized.general, ...normalized.tech, ...normalized.entertainment];

  return {
    date: amsterdamNowParts().dateKey,
    slotKey: getCurrentSlotKey(),
    updatedAt: new Date().toISOString(),
    categories: normalized,
    all,
    // backward-compatible fields used by old frontend
    polymarket: [...normalized.general, ...normalized.tech].slice(0, 3),
    weibo: [...normalized.entertainment, ...normalized.general].slice(0, 3),
  };
}

async function getDailyHotspots() {
  if (HOTSPOT_CACHE.payload) {
    return HOTSPOT_CACHE.payload;
  }

  const payload = await buildHotspots();
  HOTSPOT_CACHE.date = payload.date;
  HOTSPOT_CACHE.payload = payload;
  HOTSPOT_CACHE.updatedAt = payload.updatedAt;
  HOTSPOT_CACHE.slotKey = payload.slotKey;
  return payload;
}

setInterval(async () => {
  try {
    if (!shouldRunScheduleNow()) return;

    const slotKey = getCurrentSlotKey();
    if (HOTSPOT_CACHE.slotKey === slotKey) return;

    const payload = await buildHotspots();
    HOTSPOT_CACHE.date = payload.date;
    HOTSPOT_CACHE.payload = payload;
    HOTSPOT_CACHE.updatedAt = payload.updatedAt;
    HOTSPOT_CACHE.slotKey = payload.slotKey;
    console.log(`[hotspots] refreshed for slot=${payload.slotKey}`);
  } catch (err) {
    console.error('[hotspots] scheduled refresh failed:', err.message);
  }
}, 4 * 60 * 60 * 1000);

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
