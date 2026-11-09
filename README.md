# ⚡ Zernio Marketing Suite

**The Autonomous Social & Paid Growth Engine built on top of the [Zernio API](https://zernio.com).**

Engineered for the Zernio challenge by Jorge Luis. Bridges organic social publishing and unified paid advertising into an automated, closed-loop growth flywheel.

---

## 🏆 Products Overview

### 1. ⚡ AutoBoost (Organic ➔ Paid Ad Arbitrage)
* **The Insight:** Buffer, Hootsuite, and Ayrshare only schedule organic posts. Only Zernio unifies **16 Organic Social Platforms** and **9 Paid Ad Networks** in a single REST API.
* **Velocity Telemetry:** Tracks post velocity ($\text{likes/hr}$ vs. baseline) via Zernio `GET /v1/posts`. The second a post outperforms 95% of historical content (>3x velocity), AutoBoost flags it for paid promotion.
* **1-Click Boost (`POST /v1/ads/boost`):** Provisions the full ad hierarchy (Campaign $\to$ Ad Set $\to$ Creative $\to$ Ad) while preserving original organic social proof (likes & comments).
* **Multi-Network Support:**
  - **Meta Ads (Facebook & Instagram):** Advantage+ campaigns, Instagram boost, and Click-to-WhatsApp.
  - **Google Ads:** Search campaigns, Performance Max asset groups, and keyword metrics.
  - **TikTok Ads:** In-Feed ads, TikTok Spark Ads (`sparkAuthCode`), and Smart+ campaigns.
  - **X / Twitter Ads:** Promoted Tweets with lifetime budget caps.
* **Autonomous Safeguards (`GET /v1/ads/rules/templates`):** Attaches Zernio's built-in `stop_losers` rule (auto-pauses ad sets if CPA > $25) and `scale_winners` rule (auto-scales daily budget by 10% if ROAS is positive).

---

### 2. 🕵️ Competitor Ad Spy & AI Hook Extractor (`GET /v1/ads/library`)
* **Zero Facebook Authentication Required:** Queries Meta's public Ad Archive directly using **Zernio's internal developer credentials**.
* **Instant Market Intelligence:** Search any brand (Shopify, Notion, Linear) or niche (SaaS, AI, E-Com) to see what ads competitors are spending real money on.
* **AI Hook Extraction:** Classifies competitor copy frameworks (*Risk-Reversal / Guarantee*, *Problem-Agitate-Solve*, *Social Proof & Metrics*).
* **1-Click "Adopt Hook":** Blends the competitor's proven opening angle with your organic post's value proposition and launches the Boost modal pre-filled with the transformed ad copy.

---

### 3. ✈️ Telegram Social Copilot: Live Bot ([@ZernioJorge_bot](https://t.me/ZernioJorge_bot))
* **Zero-Dashboard Social Management:** Dictate or text ideas into Telegram on your phone.
* **Multi-Platform Pre-Flight Validation:** Calls Zernio's `POST /v1/tools/validate/post-length` to check character counts across networks before publishing.
* **Algorithmic Peak Timing:** Calls Zernio's `GET /v1/analytics/best-time` to compute the optimal scheduling slot based on account history (`⏰ Schedule at Peak (Thu 08:00 UTC)`).
* **1-Tap Live Dispatch:** Tap `[ 🚀 Publish Now ]` inline button to fire `POST /v1/posts` on Zernio and edit the message in-place with the live Post ID.
* **Mobile Ad Spy:** Send `/spy <niche>` (e.g. `/spy saas`) in Telegram to receive live Meta competitor ads directly in your chat.
* **Multi-Tenant Key Pairing:** Any user can authenticate their own Zernio account by sending `/key sk_...`.

---

## 🛠️ Zernio API Endpoints Implemented

| Endpoint | Method | Purpose in Suite |
| :--- | :--- | :--- |
| `/v1/posts` | `GET` | Ingests organic post stream & performance telemetry |
| `/v1/ads/boost` | `POST` | Provisions live ad campaign from organic post |
| `/v1/ads/library` | `GET` | Queries live Meta Ad Library archive with zero accounts |
| `/v1/ads/rules/templates` | `GET` | Ingests autonomous ad rules (`stop_losers`, `scale_winners`) |
| `/v1/analytics/best-time` | `GET` | Computes peak engagement slots by day and UTC hour |
| `/v1/tools/validate/post-length` | `POST` | Pre-flight character limit validator for Twitter & LinkedIn |
| `/v1/posts` | `POST` | Omnichannel live post publishing |
| `/v1/accounts` | `GET` | Dynamic account resolution for posting and advertising |
| `/v1/profiles` | `GET` | Multi-profile tenant workspace management |

---

## 🔬 Zernio API Technical Audit & Edge Cases

During our implementation, we documented several edge cases, undocumented requirements, and broken Meta URLs across Zernio's endpoints.

👉 **Read the full developer report with reproductions and suggested fixes:**  
**[`api-feedback/API_AUDIT_REPORT.md`](api-feedback/API_AUDIT_REPORT.md)**

*Topics covered in the report:*
1. **Broken Meta Ad Library Snapshot URL:** `render_ad/?id=...` returning 404 & public canonical fix.
2. **Undocumented Mandatory `profileId`:** `GET /v1/connect/:platform` 400 error & auto-fallback fix.
3. **CORS Policy for SPAs:** Preflight restrictions for client-side apps & dashboard origins recommendation.
4. **Click-to-WhatsApp (CTWA) Objective Mismatch:** `POST /v1/ads/boost` Meta objective auto-injection.
5. **Ad Account ID Redundancy:** Defaulting to primary active ad account.
6. **Product Feature Opportunity:** Native viral velocity & breakout telemetry on `GET /v1/posts`.

---

## 🚀 Quickstart (Run Locally in 60 Seconds)

### 1. Clone & Install
```bash
git clone <repo-url>
cd autoboost
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Zernio API Key (and optionally your Telegram Bot token):
```env
ZERNIO_API_KEY=sk_your_zernio_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
PORT=5176
```

### 3. Start Both Services
In terminal 1 (Telegram bot daemon & API proxy):
```bash
node bot.js
```

In terminal 2 (Vite web dashboard):
```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 🧪 Safe Dry-Run Mode
When testing `POST /v1/ads/boost`, check the **Dry-Run Mode** checkbox in the modal. This sends `validateOnly: true` in the Zernio payload, executing Meta's full campaign validation pipeline without charging your ad account.
