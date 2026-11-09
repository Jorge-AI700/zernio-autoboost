import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Network,
  Cpu
} from 'lucide-react';

interface PitchDeckProps {
  onOpenLiveEngine: () => void;
}

export const PitchDeck: React.FC<PitchDeckProps> = ({ onOpenLiveEngine }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = 3;

  const nextSlide = () => {
    if (currentSlide < slidesCount - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onOpenLiveEngine();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="w-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl transition-all relative overflow-hidden mb-8">
      {/* Slide Navigation Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center border border-brand-500/20">
            0{currentSlide + 1}
          </span>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              AutoBoost Product Deck • Slide {currentSlide + 1} of {slidesCount}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {currentSlide === 0 && "1. The 24-Hour Latency Gap in Paid Advertising"}
              {currentSlide === 1 && "2. Zernio's Unfair Advantage: The Missing Bridge"}
              {currentSlide === 2 && "3. The AutoBoost Autonomous Flywheel"}
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots & Prev/Next */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            {[0, 1, 2].map(idx => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx 
                    ? 'w-7 bg-brand-500' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded-xl border transition ${
              currentSlide === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextSlide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            <span>{currentSlide === slidesCount - 1 ? "Open Live Product" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SLIDE 1: THE PROBLEM */}
      {currentSlide === 0 && (
        <div className="space-y-8 animate-fade-in">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-xs mb-3 border border-red-500/20">
              <Clock className="w-3.5 h-3.5" />
              The Industry Problem
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              Organic Hits Die in 12 Hours. <br />
              Setting Up Ads Takes 24 Hours.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every growth team in the world suffers from a structural disconnect between organic social media and paid ad infrastructure.
            </p>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Silo A */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Silo A: Organic Social</span>
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Buffer, Hootsuite & Ayrshare
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Schedules tweets, reels, and LinkedIn posts smoothly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <strong className="text-slate-800 dark:text-slate-200">Zero ad capabilities.</strong> Cannot turn breakout posts into campaigns.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>No automated trigger when a post reaches 7x normal velocity.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                Result: Viral spike occurs $\to$ Organic reach decays within hours.
              </div>
            </div>

            {/* Silo B */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Silo B: Paid Ads Manager</span>
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Meta Ads Manager & Google Ads
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>High scale and predictable CAC when dialed in.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Requires 20+ clicks: re-upload creative, copy, UTMs, ad set configs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <strong className="text-slate-800 dark:text-slate-200">Loses existing social proof.</strong> Likes, replies, and shares from the organic hit are lost.
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                Result: Founders don't run ads because of friction & cold ad cost.
              </div>
            </div>
          </div>

          {/* The Friction Summary Bar */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <strong>The Opportunity Cost:</strong> Ads promoted from breakout organic posts convert with <strong>64% lower CPA</strong> because the market has already validated the hook!
            </span>
            <button
              onClick={nextSlide}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
            >
              See how Zernio solves this ➔
            </button>
          </div>
        </div>
      )}

      {/* SLIDE 2: ZERNIO'S UNFAIR ADVANTAGE */}
      {currentSlide === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs mb-3 border border-blue-500/20">
              <Network className="w-3.5 h-3.5" />
              The Architecture Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              Zernio is the Only Platform Unifying <br />
              Organic Social & Paid Ad Networks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No other API bridges both sides of the marketing equation in a single developer interface.
            </p>
          </div>

          {/* Visual Architecture Diagram */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left: 16 Organic Socials */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                <div className="text-2xl mb-2">🐦 💼 📸 🎵 📘</div>
                <div className="font-black text-sm text-slate-900 dark:text-white">16 Organic Networks</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Twitter/X, LinkedIn, TikTok, IG, FB, YouTube, Threads...
                </p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
                  GET /v1/posts
                </div>
              </div>

              {/* Center: Zernio Unified API Engine */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-xl shadow-brand-500/25 text-center relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 text-xl font-black">
                  ⚡
                </div>
                <div className="font-black text-base tracking-tight">Zernio REST Core</div>
                <div className="text-[11px] text-white/80 font-medium mt-1">
                  Single Auth • Unified Schema
                </div>
                <div className="mt-3 py-1 px-2.5 rounded-lg bg-black/20 text-[10px] font-mono text-brand-100">
                  POST /v1/ads/boost
                </div>
              </div>

              {/* Right: 9 Paid Ad Networks */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                <div className="text-2xl mb-2">Ⓜ️ 🎯 📱 𝕏 👔</div>
                <div className="font-black text-sm text-slate-900 dark:text-white">9 Paid Ad Networks</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Meta Ads, Google Search & PMax, TikTok Ads, Promoted Tweets...
                </p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold font-mono">
                  GET /v1/ads/accounts
                </div>
              </div>
            </div>
          </div>

          {/* Proof points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">1. Keep Social Proof</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Boosts the existing post ID so thousands of organic likes & shares are retained on the ad.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">2. Zero Ads Manager UI</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Creates Campaign $\to$ Ad Set $\to$ Ad Creative automatically without touching Facebook Business Manager.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">3. Autonomous Rules</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Attaches Zernio's <code className="text-brand-600 dark:text-brand-400">stop_losers</code> templates to auto-kill ad sets if CPA rises.</p>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: THE AUTOBOOST FLYWHEEL & LIVE LAUNCH */}
      {currentSlide === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs mb-3 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              The Engine in Action
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              The AutoBoost 3-Step Flywheel
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How AutoBoost executes autonomous organic-to-paid arbitrage in 60 seconds.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="w-7 h-7 rounded-lg bg-brand-500 text-white font-black text-xs flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Velocity Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Polls <code className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">GET /v1/posts</code> and calculates likes/hr vs 30-day baseline.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                🔥 7.6x Velocity = Breakout Hit
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="w-7 h-7 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                1-Click Micro-Budget
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Dispatches <code className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">POST /v1/ads/boost</code> to Meta, Google, or TikTok Ads.
              </p>
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                ⚡ $10/day Test Campaign Live
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="w-7 h-7 rounded-lg bg-purple-500 text-white font-black text-xs flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Autonomous Stop-Loss
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Attaches <code className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">/v1/ads/rules</code> templates to kill losing ad sets.
              </p>
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                🛡️ Zero Risk of Burned Budget
              </div>
            </div>
          </div>

          {/* Big CTA into Live Product */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent border border-brand-500/20">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Ready to see the live engine in action?
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticated live on Zernio API with active Meta Ad accounts.
              </p>
            </div>

            <button
              onClick={onOpenLiveEngine}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Jump to Live Dashboard ➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
