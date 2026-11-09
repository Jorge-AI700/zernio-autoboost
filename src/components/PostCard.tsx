import React from 'react';
import { Heart, MessageSquare, Repeat2, Eye, Flame, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { OrganicPost } from '../types';

interface PostCardProps {
  post: OrganicPost;
  onSelectForBoost: (post: OrganicPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelectForBoost }) => {
  const isTwitter = post.platform === 'twitter';
  const isLinkedIn = post.platform === 'linkedin';
  const isInstagram = post.platform === 'instagram';

  const platformBadge = () => {
    if (isTwitter) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <span>𝕏</span> Twitter
        </span>
      );
    }
    if (isLinkedIn) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span>in</span> LinkedIn
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
          <span>📸</span> Instagram
      </span>
    );
  };

  return (
    <div className={`rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative group ${
      post.boostStatus === 'boosted'
        ? 'bg-white dark:bg-[#0c1422] border-emerald-500/40 shadow-sm'
        : post.isBreakout
          ? 'bg-white dark:bg-gradient-to-b dark:from-[#131b2c] dark:to-[#0c121e] border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30'
          : 'bg-white dark:bg-[#0c121e] border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
    }`}>
      {/* Breakout Corner Ribbon */}
      {post.isBreakout && post.boostStatus !== 'boosted' && (
        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1">
          <Flame className="w-3 h-3" />
          <span>Breakout Hit</span>
        </div>
      )}

      {post.boostStatus === 'boosted' && (
        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Active Ad Boost</span>
        </div>
      )}

      <div>
        {/* Author & Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{post.author}</span>
                <span className="text-xs text-slate-400 font-mono">{post.handle}</span>
              </div>
              <span className="text-[11px] text-slate-500">{post.publishedAt}</span>
            </div>
          </div>
          {platformBadge()}
        </div>

        {/* Post Text */}
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mb-4 whitespace-pre-line font-normal">
          {post.content}
        </p>

        {/* Media Preview if attached */}
        {post.mediaUrl && (
          <div className="rounded-2xl overflow-hidden mb-4 max-h-52 border border-slate-200 dark:border-slate-800 shadow-inner">
            <img src={post.mediaUrl} alt="Post attachment" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Metrics Bar */}
        <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{post.metrics.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{post.metrics.comments}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Repeat2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{post.metrics.shares}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{(post.metrics.impressions / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Velocity Gauge */}
        <div className={`p-3.5 rounded-2xl border mb-5 ${
          post.isBreakout
            ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30'
            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Flame className={`w-3.5 h-3.5 ${post.isBreakout ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              Velocity Multiplier
            </span>
            <span className={`font-mono font-extrabold ${
              post.isBreakout ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {post.velocityMultiplier}x Baseline
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                post.isBreakout
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-brand-500'
                  : 'bg-slate-400 dark:bg-slate-600'
              }`}
              style={{ width: `${Math.min(post.velocityMultiplier * 14, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          ID: {post.id}
        </span>

        {post.boostStatus === 'boosted' ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Delivering Ad ({post.boostedAdId})</span>
          </div>
        ) : (
          <button
            onClick={() => onSelectForBoost(post)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              post.isBreakout
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Boost as Paid Ad</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
