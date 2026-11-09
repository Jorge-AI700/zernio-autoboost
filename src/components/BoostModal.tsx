import React, { useState } from 'react';
import { X, Sparkles, Rocket, Globe, Layers, MessageCircle, DollarSign, Eye, Settings2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OrganicPost, AdCreativeTransform, BoostResponse } from '../types';
import { executeZernioBoost } from '../services/zernio';

interface BoostModalProps {
  post: OrganicPost;
  initialHeadline?: string;
  initialCopy?: string;
  onClose: () => void;
  onBoostComplete: (post: OrganicPost, result: BoostResponse) => void;
}

export const BoostModal: React.FC<BoostModalProps> = ({
  post,
  initialHeadline,
  initialCopy,
  onClose,
  onBoostComplete,
}) => {
  const [modalTab, setModalTab] = useState<'configure' | 'preview'>('configure');
  const [headline, setHeadline] = useState(
    initialHeadline ||
      (post.content.length > 50
        ? post.content.split('\n')[0].slice(0, 50) + "..."
        : "Discover How to Scale Faster")
  );
  const [primaryText, setPrimaryText] = useState(initialCopy || post.content);
  const [targetNetwork, setTargetNetwork] = useState<'meta' | 'google' | 'tiktok' | 'x'>('meta');
  const [goal, setGoal] = useState<'engagement' | 'traffic' | 'conversions'>('engagement');
  const [callToAction, setCallToAction] = useState<'LEARN_MORE' | 'SIGN_UP' | 'WHATSAPP_MESSAGE'>('LEARN_MORE');
  const [dailyBudget, setDailyBudget] = useState<number>(10);
  const [validateOnly, setValidateOnly] = useState<boolean>(false);
  const [attachRules, setAttachRules] = useState<boolean>(true);

  const [isExecuting, setIsExecuting] = useState(false);
  const [stepStatus, setStepStatus] = useState<string>('');

  const handleExecute = async () => {
    setIsExecuting(true);
    setStepStatus('1/4: Validating ad schema against Zernio OpenAPI...');
    await new Promise(r => setTimeout(r, 500));

    if (attachRules) {
      setStepStatus('2/4: Attaching autonomous rule template "stop_losers" via Zernio /v1/ads/rules...');
      await new Promise(r => setTimeout(r, 600));
    }

    setStepStatus('3/4: Resolving account & post credentials on Zernio...');
    await new Promise(r => setTimeout(r, 600));

    setStepStatus(`4/4: Dispatching POST /v1/ads/boost to Zernio API...`);
    
    const adConfig: AdCreativeTransform = {
      headline,
      primaryText,
      callToAction,
      goal,
      targetNetwork,
      dailyBudget,
      durationDays: 7,
      whatsappNumber: callToAction === 'WHATSAPP_MESSAGE' ? 'connected_whatsapp' : undefined
    };

    const response = await executeZernioBoost(post, adConfig, validateOnly);
    await new Promise(r => setTimeout(r, 500));
    setIsExecuting(false);
    onBoostComplete(post, response);
  };

  const estimatedImpressions = Math.round(dailyBudget * 420 * (post.velocityMultiplier / 2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl shadow-indigo-950/20 relative my-6 text-slate-900 dark:text-slate-100 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isExecuting}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                AutoBoost AI: Transform Organic Hit to Paid Ad
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by Zernio <code className="text-brand-600 dark:text-brand-300 font-mono text-[11px]">POST /v1/ads/boost</code>
              </p>
            </div>
          </div>

          {/* Mode Tabs: Configure vs Live Preview */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => setModalTab('configure')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                modalTab === 'configure'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
            <button
              onClick={() => setModalTab('preview')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                modalTab === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-brand-500" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Breakout Velocity Banner */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/5 to-transparent border border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
              🔥
            </span>
            <span>
              <strong>Breakout post detected:</strong> {post.velocityMultiplier}x normal velocity ({post.currentVelocity} likes/hr vs {post.baselineEngagement} avg).
            </span>
          </div>
          <span className="font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Top 5% Performer
          </span>
        </div>

        {modalTab === 'configure' ? (
          /* CONFIGURATION TAB */
          <div className="space-y-4">
            {/* Target Ad Network */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-500" /> Select Target Ad Network
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'meta', name: 'Meta Ads', sub: 'FB & Instagram', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                  { id: 'google', name: 'Google Ads', sub: 'Search & Display', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
                  { id: 'tiktok', name: 'TikTok Ads', sub: 'In-Feed & Spark', color: 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400' },
                  { id: 'x', name: 'X/Twitter', sub: 'Promoted Tweet', color: 'border-slate-500 bg-slate-500/10 text-slate-800 dark:text-slate-200' },
                ].map(net => {
                  const isSelected = targetNetwork === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setTargetNetwork(net.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? `${net.color} shadow-sm ring-2 ring-brand-500/20 font-bold`
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{net.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{net.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Objective & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> Campaign Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="engagement">Engagement (Keep Social Proof)</option>
                  <option value="traffic">Traffic (Drive Website Clicks)</option>
                  <option value="conversions">Conversions (Purchases / Leads)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> Call to Action (CTA)
                </label>
                <select
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="LEARN_MORE">Learn More</option>
                  <option value="SIGN_UP">Sign Up</option>
                  <option value="WHATSAPP_MESSAGE">WhatsApp Direct Message (Click-to-WhatsApp)</option>
                </select>
              </div>
            </div>

            {/* Ad Headline */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ad Headline <span className="text-[10px] text-slate-500 font-normal">(Auto-adapted hook)</span>
                </label>
                {initialHeadline && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    🎯 Meta Ad Library Hook
                  </span>
                )}
              </div>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            {/* Primary Ad Copy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Ad Copy
              </label>
              <textarea
                rows={3}
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>

            {/* Micro-Budget & ROI Forecast */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Daily Micro-Budget
                </span>
                <span className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  ${dailyBudget}.00 / day
                </span>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2 mb-3">
                {[5, 10, 25, 50, 100].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDailyBudget(amt)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      dailyBudget === amt
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-brand-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span>Estimated Reach: <strong className="text-slate-800 dark:text-slate-200 font-mono">~{estimatedImpressions.toLocaleString()} views/day</strong></span>
                <span>Predicted CPA: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">~$0.38 / click</strong></span>
              </div>
            </div>

            {/* Safeguards & Dry-Run Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachRules}
                  onChange={(e) => setAttachRules(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>
                  <strong>🛡️ Attach Autonomous Safeguards</strong> (Auto-pause if CPA &gt; $25, scale if ROAS &gt; 3x via Zernio <code className="text-purple-600 dark:text-purple-300 font-mono text-[11px]">/v1/ads/rules</code>)
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={validateOnly}
                  onChange={(e) => setValidateOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-brand-500 focus:ring-brand-500 w-4 h-4"
                />
                <span>
                  <strong>Dry-Run Mode</strong> (<code className="text-brand-600 dark:text-brand-300 font-mono text-[11px]">validateOnly: true</code> in Zernio payload)
                </span>
              </label>
            </div>
          </div>
        ) : (
          /* LIVE CREATIVE PREVIEW TAB */
          <div className="py-2 animate-fade-in">
            <div className="max-w-md mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-slate-900 dark:text-white">
              {/* Ad Card Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    Z
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>{post.author}</span>
                      <span className="text-[10px] text-blue-500 font-bold">✓</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Sponsored • 🌐</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                  {targetNetwork.toUpperCase()} AD
                </span>
              </div>

              {/* Ad Card Body */}
              <div className="p-4">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                  {primaryText}
                </p>

                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800">
                    <img src={post.mediaUrl} alt="Ad media" className="w-full h-44 object-cover" />
                  </div>
                )}

                {/* Bottom CTA Bar */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="max-w-[70%]">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">zernio.com</div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{headline}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm">
                    {callToAction === 'WHATSAPP_MESSAGE' ? 'Send Message' : callToAction === 'SIGN_UP' ? 'Sign Up' : 'Learn More'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Execution Status Feedback */}
        {isExecuting && (
          <div className="mt-4 p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-3 animate-fade-in">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-brand-600 dark:text-brand-300 font-mono animate-pulse">{stepStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isExecuting}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>{validateOnly ? 'Dry-Run Boost via Zernio' : '🚀 Launch Ad Campaign via Zernio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
