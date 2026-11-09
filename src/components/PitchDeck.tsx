import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Network
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="w-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl transition-all relative overflow-hidden mb-8 min-h-[480px] flex flex-col justify-between">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-sm flex items-center justify-center border border-brand-500/20">
            0{currentSlide + 1}
          </span>
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            {currentSlide === 0 && "The Problem"}
            {currentSlide === 1 && "The Zernio Advantage"}
            {currentSlide === 2 && "The AutoBoost Solution"}
          </div>
        </div>

        {/* Navigation */}
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
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded-xl border transition ${
              currentSlide === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextSlide}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            <span>{currentSlide === slidesCount - 1 ? "Live Demo" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SLIDE 1: THE PROBLEM (Minimal, high-contrast) */}
      {currentSlide === 0 && (
        <div className="py-6 space-y-8 animate-fade-in flex-1 flex flex-col justify-center">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5 mb-2">
              <Flame className="w-3.5 h-3.5" /> The Core Problem
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Viral momentum <br />
              <span className="text-red-500">is almost always wasted.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">The Algorithmic Decay</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Temporary Spike, No Pipeline</div>
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 shrink-0" /> Posts vanish from feeds with zero permanent customer acquisition
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">The Ad Manager Friction</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Too Slow to Catch the Wave</div>
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 shrink-0" /> 20+ manual setup steps • Loses all original organic social proof
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Market fact: Boosting proven organic hits converts with <strong>64% lower CPA</strong> than cold ads.</span>
          </div>
        </div>
      )}

      {/* SLIDE 2: THE ZERNIO ADVANTAGE */}
      {currentSlide === 1 && (
        <div className="py-6 space-y-8 animate-fade-in flex-1 flex flex-col justify-center">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-500 flex items-center gap-1.5 mb-2">
              <Network className="w-3.5 h-3.5" /> The Missing Bridge
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              One Unified API <br />
              <span className="text-brand-500">For Organic + Paid Ads.</span>
            </h2>
          </div>

          {/* Architecture Flow */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="flex-1">
                <div className="text-2xl mb-1">📱 💼 📸 🎵</div>
                <div className="text-base font-black text-slate-900 dark:text-white">16 Organic Networks</div>
                <div className="text-[11px] text-slate-400 font-mono">GET /v1/posts</div>
              </div>

              <div className="text-brand-500 font-black text-xl px-4">➔</div>

              <div className="p-4 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20 text-center shrink-0">
                <div className="text-lg font-black">⚡ Zernio API Core</div>
                <div className="text-[10px] text-brand-100 font-mono">POST /v1/ads/boost</div>
              </div>

              <div className="text-brand-500 font-black text-xl px-4">➔</div>

              <div className="flex-1">
                <div className="text-2xl mb-1">Ⓜ️ 🎯 📱 𝕏</div>
                <div className="text-base font-black text-slate-900 dark:text-white">9 Paid Ad Networks</div>
                <div className="text-[11px] text-slate-400 font-mono">Meta, Google, TikTok, X</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Keeps original likes & comments
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero Facebook login needed
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Built-in stop-loss templates
            </span>
          </div>
        </div>
      )}

      {/* SLIDE 3: AUTOBOOST FLYWHEEL */}
      {currentSlide === 2 && (
        <div className="py-6 space-y-8 animate-fade-in flex-1 flex flex-col justify-center">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5" /> The Autonomous Engine
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Viral Spike ➔ Paid Ad <br />
              <span className="text-emerald-500">In 60 Seconds.</span>
            </h2>
          </div>

          {/* 3 Step Micro-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-black text-brand-500 uppercase tracking-widest mb-1">01 / Detect</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mb-1">7.6x Velocity Spike</div>
              <p className="text-xs text-slate-500 font-mono">GET /v1/posts</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">02 / Boost</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mb-1">1-Click Micro Ad</div>
              <p className="text-xs text-slate-500 font-mono">POST /v1/ads/boost</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">03 / Protect</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mb-1">Auto Stop-Loss</div>
              <p className="text-xs text-slate-500 font-mono">GET /v1/ads/rules</p>
            </div>
          </div>

          {/* Big CTA */}
          <button
            onClick={onOpenLiveEngine}
            className="w-full sm:w-auto self-start flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Open Live AutoBoost Engine ➔</span>
          </button>
        </div>
      )}
    </div>
  );
};
