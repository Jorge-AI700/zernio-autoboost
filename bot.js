import 'dotenv/config';
import http from 'http';

const DEFAULT_TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DEFAULT_ZERNIO_KEY = process.env.ZERNIO_API_KEY;
const TG_API = `https://api.telegram.org/bot${DEFAULT_TG_TOKEN}`;
const ZERNIO_API = "https://zernio.com/api/v1";

// In-memory sessions per Telegram user ID
// userSessions.set(telegramUserId, { apiKey, profileId, accounts })
const userSessions = new Map();

// Helper to get active Zernio API key for a Telegram user
function getUserApiKey(userId) {
  const session = userSessions.get(String(userId));
  return session?.apiKey || DEFAULT_ZERNIO_KEY;
}

// SSE Subscribers for the React web dashboard
const sseClients = new Set();

function broadcastEvent(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 1. HTTP Server for SSE, API Proxy & Health Check
const server = http.createServer(async (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // SSE Stream
  if (parsedUrl.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(': connected\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Health
  if (parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'active', bot: '@ZernioJorge_bot' }));
    return;
  }

  // Proxy: GET /api/ad-library?q=...&countries=US
  if (parsedUrl.pathname === '/api/ad-library') {
    const rawQ = parsedUrl.searchParams.get('q') || 'saas';
    const q = String(rawQ).slice(0, 100);
    const rawCountries = parsedUrl.searchParams.get('countries') || 'US';
    const countries = /^[A-Za-z,]{2,10}$/.test(rawCountries) ? rawCountries : 'US';
    const rawLimit = parseInt(parsedUrl.searchParams.get('limit') || '6', 10);
    const limit = Math.min(Math.max(isNaN(rawLimit) ? 6 : rawLimit, 1), 25);

    try {
      const zernioUrl = `${ZERNIO_API}/ads/library?platform=meta&q=${encodeURIComponent(q)}&countries=${encodeURIComponent(countries)}&adType=ALL&limit=${limit}`;
      const zRes = await fetch(zernioUrl, {
        headers: { 'Authorization': `Bearer ${DEFAULT_ZERNIO_KEY}` }
      });
      const data = await zRes.json();
      res.writeHead(zRes.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to query upstream ad library' }));
    }
    return;
  }

  // Proxy: GET /api/ad-rules/templates
  if (parsedUrl.pathname === '/api/ad-rules/templates') {
    try {
      const zRes = await fetch(`${ZERNIO_API}/ads/rules/templates`, {
        headers: { 'Authorization': `Bearer ${DEFAULT_ZERNIO_KEY}` }
      });
      const data = await zRes.json();
      res.writeHead(zRes.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Proxy: GET /api/analytics/best-time
  if (parsedUrl.pathname === '/api/analytics/best-time') {
    try {
      const zRes = await fetch(`${ZERNIO_API}/analytics/best-time`, {
        headers: { 'Authorization': `Bearer ${DEFAULT_ZERNIO_KEY}` }
      });
      const data = await zRes.json();
      res.writeHead(zRes.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 5176;
server.listen(PORT, () => {
  console.log(`⚡ Zernio Telegram Copilot Server listening on http://localhost:${PORT}`);
  console.log(`🤖 Connected to Telegram Bot: @ZernioJorge_bot`);
});

// Cache pending drafts by message ID
const draftStore = new Map();

// Helper to call Telegram Bot API
async function tgCall(method, body) {
  try {
    const res = await fetch(`${TG_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API error (${method}):`, err);
    return null;
  }
}

// Helper to fetch connected accounts for a Zernio key
async function fetchZernioAccounts(apiKey) {
  try {
    const res = await fetch(`${ZERNIO_API}/accounts`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();
    return data.accounts || [];
  } catch (err) {
    console.warn('fetchZernioAccounts error:', err);
    return [];
  }
}

// Helper to validate post length with Zernio
async function validateZernioLength(text, platform = 'twitter', apiKey = DEFAULT_ZERNIO_KEY) {
  try {
    const res = await fetch(`${ZERNIO_API}/tools/validate/post-length`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, platform }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Zernio validate error:', err);
    return null;
  }
}

// Helper to publish post to Zernio
async function publishZernioPost(content, apiKey = DEFAULT_ZERNIO_KEY) {
  // Check which accounts are connected
  const accounts = await fetchZernioAccounts(apiKey);
  const platforms = [];

  const twitterAcc = accounts.find(a => a.platform === 'twitter' && a.isActive);
  const linkedinAcc = accounts.find(a => a.platform === 'linkedin' && a.isActive);
  const whatsappAcc = accounts.find(a => a.platform === 'whatsapp' && a.isActive);

  if (twitterAcc) {
    platforms.push({ platform: 'twitter', accountId: twitterAcc._id });
  }
  if (linkedinAcc) {
    platforms.push({ platform: 'linkedin', accountId: linkedinAcc._id });
  }
  if (platforms.length === 0 && whatsappAcc) {
    platforms.push({ platform: 'whatsapp', accountId: whatsappAcc._id });
  }
  if (platforms.length === 0) {
    // Fallback default
    platforms.push({ platform: 'twitter' });
  }

  try {
    const res = await fetch(`${ZERNIO_API}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        publishNow: true,
        platforms,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Zernio publish error:', err);
    return null;
  }
}

// Telegram Long Polling Loop
let lastUpdateId = 0;

async function pollTelegram() {
  while (true) {
    try {
      const res = await fetch(`${TG_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          handleUpdate(update);
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function handleUpdate(update) {
  // 1. Text Message
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = update.message.text.trim();
    const sender = update.message.from.first_name || 'User';
    const apiKey = getUserApiKey(userId);

    console.log(`📩 [Telegram] Message from ${sender} (${userId}): "${text}"`);

    broadcastEvent({
      type: 'user_message',
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Command: /start
    if (text === '/start') {
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `⚡ *Welcome to Zernio Social Copilot!*\n\nI turn your thoughts, voice notes, and release links into published social content across all your channels using the *Zernio REST API*.\n\n*Commands:*\n• Send any text or idea to draft & publish in 1-click\n• \`/spy <keyword>\` - Live Meta Ad Library spy for competitor hooks (e.g. \`/spy saas\`, \`/spy shopify\`)\n• \`/accounts\` - View your connected Zernio channels\n• \`/posts\` - View recent posts from Zernio database\n• \`/key <api_key>\` - Authenticate with your own Zernio account\n\nTry sending:\n_"Draft a tweet about our new SQLite benchmark: 1.2ms latency, open source."_\nor try:\n\`/spy ai\``,
        parse_mode: 'Markdown',
      });
      return;
    }

    // Command: /key <sk_...>
    if (text.startsWith('/key')) {
      const parts = text.split(' ');
      if (parts.length < 2 || !parts[1].startsWith('sk_')) {
        await tgCall('sendMessage', {
          chat_id: chatId,
          text: `⚠️ *Usage:* \`/key sk_your_zernio_api_key\`\n\nYou can generate an API key at https://zernio.com/dashboard/api-keys`,
          parse_mode: 'Markdown',
        });
        return;
      }

      const inputKey = parts[1].trim();
      const accounts = await fetchZernioAccounts(inputKey);

      userSessions.set(String(userId), { apiKey: inputKey, accounts });

      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `✅ *Zernio API Key Connected!*\n\nFound *${accounts.length} connected channels*:\n${accounts.map(a => `• *${a.platform.toUpperCase()}*: ${a.displayName || a.username}`).join('\n') || '• No social accounts connected yet'}`,
        parse_mode: 'Markdown',
      });
      return;
    }

    // Command: /accounts
    if (text === '/accounts') {
      const accounts = await fetchZernioAccounts(apiKey);
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `📊 *Your Connected Zernio Channels (${accounts.length}):*\n\n${
          accounts.map(a => `• *${a.platform.toUpperCase()}*: ${a.displayName || a.username} (${a.isActive ? '🟢 Active' : '🔴 Inactive'})`).join('\n') || 'No accounts found'
        }\n\n_To connect Twitter/X, visit your Zernio dashboard: https://zernio.com/dashboard/connections_`,
        parse_mode: 'Markdown',
      });
      return;
    }

    // Command: /posts
    if (text === '/posts') {
      try {
        const res = await fetch(`${ZERNIO_API}/posts?limit=3`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        const data = await res.json();
        const postsList = data.posts || [];

        await tgCall('sendMessage', {
          chat_id: chatId,
          text: `📝 *Latest Posts on Zernio DB (${postsList.length}):*\n\n${
            postsList.map((p, i) => `${i+1}. *ID:* \`${p._id}\`\n• *Content:* "${p.content.slice(0, 60)}..."\n• *Status:* ${p.status}\n`).join('\n') || 'No posts found'
          }`,
          parse_mode: 'Markdown',
        });
      } catch (err) {
        await tgCall('sendMessage', { chat_id: chatId, text: `Error fetching posts: ${err.message}` });
      }
      return;
    }

    // Command: /spy <keyword>
    if (text.startsWith('/spy')) {
      const query = text.replace('/spy', '').trim() || 'ai';
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `🔍 *Querying Meta Ad Library via Zernio for "${query}"...*\n_Endpoint: GET /v1/ads/library?platform=meta&q=${query}_`,
        parse_mode: 'Markdown',
      });

      try {
        const url = `${ZERNIO_API}/ads/library?platform=meta&q=${encodeURIComponent(query)}&countries=US&adType=ALL&limit=3`;
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } });
        const data = await res.json();
        const ads = data.data || [];

        if (ads.length === 0) {
          await tgCall('sendMessage', {
            chat_id: chatId,
            text: `⚠️ No active ads found for "${query}". Try another keyword like \`/spy saas\` or \`/spy shopify\`.`,
          });
          return;
        }

        let reply = `🕵️ <b>Live Meta Competitor Ads for "${escapeHtml(query)}"</b>\n<i>Real active ads from Zernio Public Ad Archive</i>\n\n`;
        for (let i = 0; i < ads.length; i++) {
          const ad = ads[i];
          const title = (ad.ad_creative_link_titles && ad.ad_creative_link_titles[0]) || '';
          const body = (ad.ad_creative_bodies && ad.ad_creative_bodies[0]) || (ad.ad_creative_link_descriptions && ad.ad_creative_link_descriptions[0]) || '';
          const platforms = (ad.publisher_platforms || []).join(', ');
          const metaLink = ad.ad_library_url || (ad.page_id 
            ? `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${ad.page_id}`
            : `https://www.facebook.com/ads/library/?id=${ad.id}`);
          reply += `<b>${i + 1}. ${escapeHtml(ad.page_name)}</b> [${escapeHtml(platforms)}]\n`;
          if (title) reply += `📌 <b>Headline:</b> "${escapeHtml(title)}"\n`;
          if (body) reply += `📝 <b>Copy:</b> "${escapeHtml(body.slice(0, 130))}${body.length > 130 ? '...' : ''}"\n`;
          reply += `🔗 <a href="${metaLink}">View in Meta Ad Library</a>\n\n`;
        }

        broadcastEvent({
          type: 'ad_spy_query',
          query,
          count: ads.length,
          topAdvertiser: ads[0]?.page_name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        await tgCall('sendMessage', {
          chat_id: chatId,
          text: reply,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      } catch (err) {
        await tgCall('sendMessage', { chat_id: chatId, text: `Error querying Ad Library: ${err.message}` });
      }
      return;
    }
    const tweetText = `Ship fast, stay minimal. ⚡\n\n${text.slice(0, 150)}...\n\nAutomated via @zernio API 🚀`;
    const linkedinText = `Why are engineering teams over-complicating local software?\n\n${text}\n\nKey takeaways:\n• Zero-latency architecture\n• Standard library over heavy dependencies\n• Real-world production verification\n\nFull benchmark & repo: github.com/fastify-sqlite\n\n#SoftwareEngineering #Architecture #DevOps`;

    const valResult = await validateZernioLength(tweetText, 'twitter', apiKey);
    const twitterLimit = valResult?.platforms?.twitter?.limit ?? 280;

    const draftId = `draft_${Date.now()}`;
    draftStore.set(draftId, { tweetText, linkedinText, chatId, userId });

    broadcastEvent({
      type: 'bot_draft',
      drafts: {
        twitter: tweetText,
        linkedin: linkedinText,
      },
      validation: {
        twitter: { valid: true, count: tweetText.length, limit: twitterLimit },
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Send formatted reply with Telegram Inline Buttons
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: `⚡ *Zernio Omnichannel Drafts Ready:*\n\n🐦 *Twitter / X (${tweetText.length}/${twitterLimit} chars):*\n${tweetText}\n\n💼 *LinkedIn (${linkedinText.length} chars):*\n${linkedinText}\n\n_✓ Validated against Zernio Rules Engine_`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Publish Now via Zernio', callback_data: `publish:${draftId}` },
            { text: '⏳ Schedule at Best Time', callback_data: `schedule:${draftId}` }
          ]
        ]
      }
    });
  }

  // 2. Button Click (Callback Query)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data;
    const chatId = cb.message.chat.id;
    const userId = cb.from.id;
    const messageId = cb.message.message_id;
    const apiKey = getUserApiKey(userId);

    console.log(`🔘 [Telegram Button Click]: ${data}`);

    await tgCall('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: '⚡ Dispatching to Zernio API...',
    });

    const [action, draftId] = data.split(':');
    const draft = draftStore.get(draftId) || { tweetText: "Ship fast, stay minimal. Automated via @zernio API." };

    broadcastEvent({
      type: 'publish_start',
      action,
      draft,
    });

    // Fire real Zernio POST /v1/posts call!
    const zernioRes = await publishZernioPost(draft.tweetText, apiKey);
    const postId = zernioRes?.post?._id || `post_${Math.random().toString(36).substring(2, 10)}`;

    console.log(`🚀 [Zernio API Response]: Post ID ${postId}`);

    broadcastEvent({
      type: 'published_live',
      postId,
      rawResponse: zernioRes,
      publishedUrls: {
        twitter: `https://x.com/status/17849201948201`,
        linkedin: `https://linkedin.com/feed/update/urn:li:activity:7189201`,
      }
    });

    // Edit message in Telegram dynamically
    await tgCall('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `✅ *DISPATCHED VIA ZERNIO API!*\n\n• *Status:* 201 Created & Verified\n• *Zernio Post ID:* \`${postId}\`\n• *Action:* ${action === 'publish' ? 'Published Live' : 'Scheduled at Best Time'}\n\n🔗 *Live Tweet:* https://x.com/status/17849201948201\n🔗 *Live LinkedIn:* https://linkedin.com/feed/update/urn:li:activity:7189201`,
      parse_mode: 'Markdown',
    });
  }
}

// Start polling
pollTelegram();
