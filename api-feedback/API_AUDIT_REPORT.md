# Zernio Developer API: Technical Audit & Edge Case Report

> **Audited by:** AutoBoost AI Engineering  
> **Prepared for:** Pau Guirao & the Zernio Core Engineering Team (`zernio-dev`)  
> **Target API:** `https://zernio.com/api/v1`  
> **Date:** November 2026  

---

## Executive Summary

While building **AutoBoost AI** (an autonomous organic-to-paid ad engine and Telegram social manager built natively on top of Zernio's REST API), we deeply stress-tested Zernio's endpoints across **Posts**, **Ad Management**, **Ad Library Spy**, **Rule Templates**, and **OAuth Connectors**.

Zernio’s unified API architecture—combining **16 organic social platforms** and **9 paid ad networks** under a single REST interface—is best-in-class. 

During our implementation, we documented several edge cases, broken URLs, and developer experience friction points. We share these findings below with reproduction payloads and recommended fixes.

---

## 1. Meta Ad Library Snapshot URL 404 / Unavailable
* **Endpoint:** `GET /v1/ads/library`
* **Severity:** High (Broken UI links for end-users)

### Symptom
When querying Meta's ad library via Zernio:
```http
GET /v1/ads/library?q=nike&countries=US&limit=5
Authorization: Bearer sk_live_••••••••
```
The API returns ad items with an `ad_snapshot_url` field formatted as:
```json
{
  "id": "1298491823901",
  "page_id": "103539488800270",
  "ad_snapshot_url": "https://www.facebook.com/ads/archive/render_ad/?id=1298491823901"
}
```
When a user or frontend opens this URL, Facebook responds with:
> *"Esta página no está disponible. Es posible que el enlace esté roto o que se haya eliminado la página."*

This occurs because Meta's `/ads/archive/render_ad/` is an internal sandboxed iframe endpoint that rejects direct, unauthenticated browser navigation.

### Suggested Fix
Zernio should return the canonical, public Meta Ad Library URLs:
- **Direct Ad URL:**
  ```
  https://www.facebook.com/ads/library/?id=${ad.id}
  ```
- **Page Archive URL:**
  ```
  https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${ad.page_id}
  ```
*(In AutoBoost, we applied a client-side URL normalizer to rewrite these to the public canonical URLs).*

---

## 2. Undocumented Mandatory `profileId` on OAuth Initiation
* **Endpoint:** `GET /v1/connect/:platform` (e.g., `/v1/connect/facebook`)
* **Severity:** Medium (Fails OpenAPI validation)

### Symptom
Calling `GET /v1/connect/facebook` with only the `Authorization` header fails with `400 Bad Request`:
```json
{
  "error": "profileId is required",
  "type": "invalid_request_error",
  "code": "missing_required_field",
  "param": "profileId"
}
```
In the public OpenAPI documentation, `profileId` is either omitted or marked as optional.

### Suggested Fix
If `profileId` is omitted from the query string, the Zernio backend should automatically look up the caller's default profile (`isDefault: true`) and use it:
```typescript
// Proposed backend fallback
const targetProfileId = req.query.profileId || (await getDefaultProfile(userId))._id;
```
This reduces one extra `GET /v1/profiles` round-trip for developers.

---

## 3. Strict CORS Policy Blocking Client-Side SPAs
* **Endpoint:** `https://zernio.com/api/v1/*` (All endpoints)
* **Severity:** Medium (Architectural friction for frontend developers)

### Symptom
When a Single Page Application (React, Vue, Next.js client-side fetch) attempts to call Zernio directly:
```javascript
fetch("https://zernio.com/api/v1/posts", {
  headers: { "Authorization": "Bearer sk_live_..." }
})
```
The browser's preflight `OPTIONS` request is blocked because `Access-Control-Allow-Origin` is restricted to `https://zernio.com`.

### Current Workaround
Developers are forced to spin up a custom Node.js backend relay or Vite dev server proxy (`/api -> https://zernio.com`) solely to bypass CORS.

### Suggested Fix
1. Allow developers to specify **Allowed Frontend Origins** in the Zernio Dashboard (e.g. `http://localhost:5173`, `https://myapp.com`), similar to Stripe, Supabase, or Clerk.
2. Or support browser-safe publishable keys or client-side tokens for read-only / embeddable widgets.

---

## 4. Click-to-WhatsApp (CTWA) Objective Mismatch on Ad Boost
* **Endpoint:** `POST /v1/ads/boost`
* **Severity:** Medium (Meta Graph API rejection)

### Symptom
When boosting an organic post with a WhatsApp Call-to-Action:
```json
{
  "accountId": "acc_meta_connected",
  "callToAction": "WHATSAPP_MESSAGE",
  "whatsappPhoneNumber": "+15550192834",
  "goal": "engagement"
}
```
Meta's Ad API rejects the campaign creation unless the parent campaign objective is explicitly set to `"OUTCOME_ENGAGEMENT"`. If default objective mapping is applied, Meta throws an invalid objective/CTA combination error.

### Suggested Fix
The Zernio boost abstraction should handle this internally:
```typescript
if (payload.callToAction === "WHATSAPP_MESSAGE") {
  metaPayload.objective = "OUTCOME_ENGAGEMENT";
}
```
Third-party developers should not need to debug Meta's internal objective rules.

---

## 5. Ad Account ID Redundancy on `POST /v1/ads/boost`
* **Endpoint:** `POST /v1/ads/boost`
* **Severity:** Low (Ergonomics)

### Symptom
`POST /v1/ads/boost` requires both `accountId` (the Zernio platform connection ID) and `adAccountId` (e.g., `act_146382...`).

Since Zernio already enumerates and stores all ad accounts associated with that connection (accessible via `GET /v1/ads/accounts?accountId=...`), requiring the developer to pass both parameters adds extra querying friction.

### Suggested Fix
Make `adAccountId` optional in `POST /v1/ads/boost`. If not provided, default to the primary selected ad account for that connection (`selected: true`).

---

## 6. Feature Opportunity: Native Viral Velocity Telemetry
* **Endpoint:** `GET /v1/posts`
* **Category:** Product Enhancement

### The Opportunity
`GET /v1/posts` currently returns static counts:
```json
{
  "metrics": {
    "likes": 684,
    "comments": 92,
    "shares": 147,
    "impressions": 24800
  }
}
```
To calculate viral acceleration (e.g. *7.6x normal velocity*), external tools currently have to poll `/v1/posts` on a CRON schedule, store historical snapshots in an external database, and compute hourly deltas against a 30-day baseline.

### Suggested Enhancement
If Zernio offered an optional velocity enrichment flag:
```json
{
  "metrics": {
    "likes": 684,
    "velocity_rate": 342,
    "baseline_velocity": 45,
    "velocity_multiplier": 7.6,
    "is_breakout": true
  }
}
```
Zernio would become the **only developer platform on the planet** with native viral breakout detection, making products like AutoBoost a 1-line implementation for thousands of developers.

---

*Report prepared with care by the AutoBoost team.*
