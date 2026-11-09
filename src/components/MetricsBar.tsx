import React from 'react';
import { TrendingUp, Flame, DollarSign, Target, Activity } from 'lucide-react';
import { OrganicPost } from '../types';

interface MetricsBarProps {
  posts: OrganicPost[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ posts }) => {
  const breakoutCount = posts.filter(p => p.isBreakout).length;
  const boostedCount = posts.filter(p => p.boostStatus === 'boosted').length;
  const totalImpressions = posts.reduce((acc, p) => acc + p.metrics.impressions, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Posts Monitored</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{posts.length}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Synced via <code className="text-slate-700 dark:text-slate-300 font-mono">/v1/posts</code></span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white dark:bg-[#0c121e] border border-amber-500/30 dark:border-amber-500/30 rounded-3xl p-5 relative overflow-hidden shadow-sm hover:border-amber-500/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Breakout Hits</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{breakoutCount}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
          <span className="font-bold text-amber-600 dark:text-amber-300">&gt;3x Baseline</span>
          <span>Ready for ad boost</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Organic Reach</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {(totalImpressions / 1000).toFixed(1)}k
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          <span>Across Twitter, LinkedIn, IG</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white dark:bg-[#0c121e] border border-emerald-500/30 dark:border-emerald-500/30 rounded-3xl p-5 relative overflow-hidden shadow-sm hover:border-emerald-500/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active Ad Boosts</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{boostedCount}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">~64% lower CPA</span>
          <span>vs cold ads</span>
        </div>
      </div>
    </div>
  );
};
