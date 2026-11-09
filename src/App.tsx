import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { PostCard } from './components/PostCard';
import { BoostModal } from './components/BoostModal';
import { ApiTerminal } from './components/ApiTerminal';
import { TelegramCopilot } from './components/TelegramCopilot';
import { AdSpy } from './components/AdSpy';
import { ConnectionsView } from './components/ConnectionsView';
import { PitchDeck } from './components/PitchDeck';
import { INITIAL_POSTS, fetchProfiles, fetchAccounts } from './services/zernio';
import { OrganicPost, BoostResponse } from './types';
import { Sparkles, Layers, CheckCircle2, Zap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'autoboost' | 'adspy' | 'telegram' | 'connections'>('autoboost');
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [posts, setPosts] = useState<OrganicPost[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<'all' | 'breakout' | 'boosted'>('all');
  const [selectedPost, setSelectedPost] = useState<OrganicPost | null>(null);
  const [adoptedHook, setAdoptedHook] = useState<{ headline: string; copy: string } | null>(null);
  const [lastBoostResponse, setLastBoostResponse] = useState<BoostResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('autoboost_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('autoboost_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    fetchProfiles();
    fetchAccounts().then(setAccounts).catch(() => {});
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setPosts(prev => prev.map(p => ({
        ...p,
        metrics: {
          ...p.metrics,
          likes: p.metrics.likes + Math.floor(Math.random() * 15),
          impressions: p.metrics.impressions + Math.floor(Math.random() * 200),
        }
      })));
      setIsScanning(false);
      setSuccessToast('Refreshed metrics across connected Zernio social accounts!');
      setTimeout(() => setSuccessToast(null), 3500);
    }, 1200);
  };

  const handleSimulateBreakout = () => {
    setPosts(prev => {
      const copy = [...prev];
      copy[1] = {
        ...copy[1],
        metrics: {
          ...copy[1].metrics,
          likes: 890,
          shares: 114,
          comments: 130,
          impressions: 28400,
        },
        currentVelocity: 410,
        velocityMultiplier: 13.6,
        isBreakout: true,
      };
      return copy;
    });
    setSuccessToast('🔥 Viral breakout triggered on LinkedIn post (13.6x velocity)!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleBoostComplete = (post: OrganicPost, result: BoostResponse) => {
    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          boostStatus: 'boosted',
          boostedAdId: result.adId,
        };
      }
      return p;
    }));
    setLastBoostResponse(result);
    setSelectedPost(null);
    setAdoptedHook(null);
    setSuccessToast(`🚀 Successfully launched ${result.platform.toUpperCase()} Ad campaign (${result.adId}) via Zernio API!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleAdoptHook = (post: OrganicPost, hookHeadline: string, hookCopy: string) => {
    setSelectedPost(post);
    setAdoptedHook({ headline: hookHeadline, copy: hookCopy });
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'breakout') return p.isBreakout && p.boostStatus !== 'boosted';
    if (filter === 'boosted') return p.boostStatus === 'boosted';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-800 dark:text-slate-100 flex flex-col pb-24 transition-colors">
      <Header
        onScan={handleScan}
        onSimulateBreakout={handleSimulateBreakout}
        isScanning={isScanning}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        accounts={accounts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* Toast Notification */}
        {successToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              {successToast}
            </span>
            <button onClick={() => setSuccessToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
          </div>
        )}

        {/* TAB 1: AUTOBOOST */}
        {activeTab === 'autoboost' && (
          <>
            {/* View Mode Switcher: Deck vs Live Feed */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs self-start">
                <button
                  onClick={() => setShowPitchDeck(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    !showPitchDeck
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Live Feed Engine</span>
                </button>

                <button
                  onClick={() => setShowPitchDeck(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    showPitchDeck
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Problem & Architecture Deck</span>
                </button>
              </div>

              {showPitchDeck ? (
                <button
                  onClick={() => setShowPitchDeck(false)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Skip to Live Dashboard ➔</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowPitchDeck(true)}
                  className="text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition self-start sm:self-auto"
                >
                  <span>💡 View Problem & Architecture Deck</span>
                </button>
              )}
            </div>

            {showPitchDeck ? (
              <PitchDeck onOpenLiveEngine={() => setShowPitchDeck(false)} />
            ) : (
              <>
                {/* Hero Pitch Banner */}
                <div className="mb-8 p-7 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#0b1120] dark:to-[#070a13] border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden shadow-sm">
                  <div className="max-w-3xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-extrabold mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      Product 1: Organic ➔ Paid Ad Arbitrage
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                      Turn Breakout Organic Hits into Paid Ads in 1-Click
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
                      Buffer, Hootsuite, and Ayrshare only schedule organic posts. Only <strong className="text-slate-900 dark:text-white">Zernio</strong> supports both 
                      <span className="text-brand-600 dark:text-brand-400 font-bold"> 16 Organic Social Platforms</span> and <span className="text-brand-600 dark:text-brand-400 font-bold">9 Paid Ad Networks</span> in a single REST API. 
                      AutoBoost automatically monitors your organic velocity and triggers <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700">POST /v1/ads/boost</code> the moment a post goes viral.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Zernio Database Synced
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        Meta, Google, TikTok & X Ads
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                        Autonomous Stop-Losers Guard
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none bg-gradient-to-l from-brand-500 to-transparent"></div>
                </div>

                {/* Metrics Grid */}
                <MetricsBar posts={posts} />

                {/* Filter Tabs & Content Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                      Organic Post Velocity Stream
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live feeds monitored via Zernio <code className="text-slate-700 dark:text-slate-300 font-mono">/v1/posts</code></p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                    {[
                      { id: 'all', label: 'All Posts' },
                      { id: 'breakout', label: '🔥 Breakout Hits' },
                      { id: 'boosted', label: '✅ Active Boosts' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          filter === tab.id
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelectForBoost={(p) => setSelectedPost(p)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: AD SPY */}
        {activeTab === 'adspy' && (
          <AdSpy
            posts={posts}
            onAdoptHookForBoost={handleAdoptHook}
          />
        )}

        {/* TAB 3: TELEGRAM COPILOT */}
        {activeTab === 'telegram' && (
          <div>
            {/* Banner */}
            <div className="mb-8 p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#112338] dark:via-[#0c1827] dark:to-[#0a0e17] border border-sky-500/20 relative overflow-hidden shadow-sm">
              <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Product 2: Zero-Dashboard Social Media Manager
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Telegram Social Copilot: Text or Speak, 1-Tap Publish
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Send a text or voice note into Telegram on your phone. The copilot formats native drafts for Twitter and LinkedIn, validates character limits via <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-mono">POST /v1/tools/validate/post-length</code>, and displays Telegram inline buttons. Tap <strong className="text-sky-500">[ 🚀 Publish Now ]</strong> to dispatch live across all networks via Zernio.
                </p>
              </div>

              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none bg-gradient-to-l from-sky-500 to-transparent"></div>
            </div>

            {/* Telegram Component */}
            <TelegramCopilot />
          </div>
        )}

        {/* TAB 4: ZERNIO CONNECTIONS & AD ACCOUNTS */}
        {activeTab === 'connections' && (
          <ConnectionsView />
        )}
      </main>

      {/* Boost Modal (for Tab 1 & Tab 2 Hook Adoption) */}
      {selectedPost && (
        <BoostModal
          post={selectedPost}
          initialHeadline={adoptedHook?.headline}
          initialCopy={adoptedHook?.copy}
          onClose={() => {
            setSelectedPost(null);
            setAdoptedHook(null);
          }}
          onBoostComplete={handleBoostComplete}
        />
      )}

      {/* Sticky Bottom API Terminal */}
      <ApiTerminal lastResponse={lastBoostResponse} />
    </div>
  );
}
