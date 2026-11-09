import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ExternalLink, ShieldAlert, Zap, Globe, Copy, Check, ArrowRight } from 'lucide-react';
import { MetaAd, OrganicPost } from '../types';
import { searchAdLibrary } from '../services/zernio';

interface AdSpyProps {
  posts: OrganicPost[];
  onAdoptHookForBoost: (post: OrganicPost, hookHeadline: string, hookCopy: string) => void;
}

const PRESET_TOPICS = [
  { id: 'ai', label: '🤖 AI & Automation', query: 'ai productivity' },
  { id: 'saas', label: '🚀 SaaS & Dev Tools', query: 'saas' },
  { id: 'ecom', label: '🛍️ Shopify & E-Com', query: 'shopify' },
  { id: 'agency', label: '📈 Growth Agency', query: 'marketing agency' },
  { id: 'fintech', label: '💳 Fintech & Payments', query: 'fintech' },
];

export const AdSpy: React.FC<AdSpyProps> = ({ posts, onAdoptHookForBoost }) => {
  const [selectedTopic, setSelectedTopic] = useState('ai');
  const [searchQuery, setSearchQuery] = useState('ai productivity');
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetPost, setTargetPost] = useState<OrganicPost>(posts[0] || null);

  const fetchAds = async (query: string) => {
    setIsLoading(true);
    const results = await searchAdLibrary(query, 'US', 6);
    setAds(results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAds(searchQuery);
  }, []);

  const handleSelectPreset = (topicId: string, query: string) => {
    setSelectedTopic(topicId);
    setSearchQuery(query);
    fetchAds(query);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedTopic('custom');
    fetchAds(searchQuery.trim());
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const detectHookType = (title: string, body: string) => {
    const combined = `${title} ${body}`.toLowerCase();
    if (combined.includes('guarantee') || combined.includes("don't pay") || combined.includes('free') || combined.includes('refund')) {
      return { label: 'Risk-Reversal / Guarantee', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    }
    if (combined.includes('stop') || combined.includes('why') || combined.includes('?') || combined.includes('spreadsheet') || combined.includes('exhausted')) {
      return { label: 'Problem-Agitate-Solve', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    if (combined.includes('%') || combined.includes('$', 0) || combined.includes('clients') || combined.includes('hours') || combined.includes('results')) {
      return { label: 'Social Proof & Metrics', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
    }
    return { label: 'Direct Value Proposition', color: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20' };
  };

  const handleAdopt = (ad: MetaAd) => {
    const title = (ad.ad_creative_link_titles && ad.ad_creative_link_titles[0]) || 'Transform Your Workflow Today';
    const rawBody = (ad.ad_creative_bodies && ad.ad_creative_bodies[0]) || (ad.ad_creative_link_descriptions && ad.ad_creative_link_descriptions[0]) || '';
    
    // AI Adaptation logic: blend competitor's opening hook with target post value proposition
    const hookFirstSentence = rawBody.split('\n')[0] || title;
    const adaptedCopy = `${hookFirstSentence}\n\nMost teams waste hours on manual overhead. With AutoBoost, your organic social hits are automatically converted into paid ads the second they go viral.\n\nAutomated via Zernio API.`;

    onAdoptHookForBoost(targetPost, title, adaptedCopy);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#151c2e] dark:via-[#0e1626] dark:to-[#0a0e17] border border-brand-500/20 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Product 3: Competitor Ad Intelligence & Angle Matcher
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Spy on Winning Meta Ads & Adapt Their Hooks in 1-Click
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Zernio provides a direct gateway to Meta's public Ad Archive via <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-mono">GET /v1/ads/library</code> using <strong className="text-slate-900 dark:text-white">Zernio developer credentials (zero Facebook login needed)</strong>. 
            Spy on what competitors are spending real money on, extract their top copywriting hooks, and blend them directly into your AutoBoost paid campaigns.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
              <Zap className="w-3 h-3 text-brand-500" />
              GET /v1/ads/library?platform=meta&q={searchQuery}
            </span>
            <span className="text-slate-500">• 0 Connected Ad Accounts Required</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Presets + Custom Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleSelectPreset(topic.id, topic.query)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTopic === topic.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleCustomSearch} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitor brand or niche..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search Meta'}
          </button>
        </form>
      </div>

      {/* Target Post Selector for Hook Adaptation */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span>
            Target organic post to adapt: <strong className="text-slate-900 dark:text-white">"{targetPost.content.slice(0, 50)}..."</strong>
          </span>
        </div>
        <select
          value={targetPost.id}
          onChange={(e) => {
            const p = posts.find(post => post.id === e.target.value);
            if (p) setTargetPost(p);
          }}
          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          {posts.map(p => (
            <option key={p.id} value={p.id}>
              {p.platform.toUpperCase()} - {p.content.slice(0, 35)}...
            </option>
          ))}
        </select>
      </div>

      {/* Ads Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 animate-pulse p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
          <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-semibold">No active ads returned for "{searchQuery}".</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for broader terms like "saas", "shopify", or "automation".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ads.map((ad, idx) => {
            const title = (ad.ad_creative_link_titles && ad.ad_creative_link_titles[0]) || '';
            const body = (ad.ad_creative_bodies && ad.ad_creative_bodies[0]) || (ad.ad_creative_link_descriptions && ad.ad_creative_link_descriptions[0]) || '';
            const hook = detectHookType(title, body);
            const platforms = ad.publisher_platforms || ['facebook', 'instagram'];
            const metaLibraryUrl = ad.ad_library_url || (ad.page_id 
              ? `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${ad.page_id}`
              : `https://www.facebook.com/ads/library/?id=${ad.id}`);

            return (
              <div
                key={ad.id || idx}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/40 transition group"
              >
                <div>
                  {/* Top Bar: Advertiser & Platforms */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {ad.page_name ? ad.page_name[0] : 'M'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                          <a
                            href={ad.page_id ? `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${ad.page_id}` : metaLibraryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-purple-600 dark:hover:text-purple-400 transition"
                            title="View all ads by this advertiser in Meta Library"
                          >
                            {ad.page_name}
                          </a>
                          <span className="text-[10px] text-sky-500 font-bold" title="Meta Ad Verified">✓</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Active since {ad.ad_delivery_start_time || ad.ad_creation_time || 'recent'}
                        </div>
                      </div>
                    </div>

                    {/* Meta Ad Library Link */}
                    <a
                      href={metaLibraryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
                      title="Open in official Meta Ads Library"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Hook Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${hook.color}`}>
                      🎯 {hook.label}
                    </span>
                  </div>

                  {/* Headline */}
                  {title && (
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {title}
                    </h3>
                  )}

                  {/* Ad Body */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-normal">
                    {body || 'Visual carousel ad format.'}
                  </p>

                  {/* Platform Icons */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {platforms.map(p => (
                      <span key={p} className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Copy & Adopt */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyText(ad.id, `${title}\n\n${body}`)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                  >
                    {copiedId === ad.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === ad.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleAdopt(ad)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Adopt Hook</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
