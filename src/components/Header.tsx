import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Key, Flame, Sun, Moon, Zap, Send, Search, Radio } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/zernio';

interface HeaderProps {
  onScan: () => void;
  onSimulateBreakout: () => void;
  isScanning: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeTab: 'autoboost' | 'adspy' | 'telegram' | 'connections';
  onSelectTab: (tab: 'autoboost' | 'adspy' | 'telegram' | 'connections') => void;
  accounts?: any[];
}

export const Header: React.FC<HeaderProps> = ({
  onScan,
  onSimulateBreakout,
  isScanning,
  theme,
  onToggleTheme,
  activeTab,
  onSelectTab,
  accounts = [],
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(getApiKey());

  const twitterAcc = accounts.find(a => a.platform === 'twitter');
  const metaAcc = accounts.find(a => a.platform === 'metaads' || a.platform === 'facebook');
  const waAcc = accounts.find(a => a.platform === 'whatsapp');

  const handleSaveKey = () => {
    setApiKey(keyInput.trim());
    setShowKeyModal(false);
    window.location.reload();
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f1523]/95 backdrop-blur-md sticky top-0 z-40 transition-colors shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[62px] py-2 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-black text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Zernio Suite
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 whitespace-nowrap">
                Pau Guirao Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
              Autonomous Ad & Social Engine
            </p>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => onSelectTab('autoboost')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'autoboost'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1. AutoBoost</span>
          </button>

          <button
            onClick={() => onSelectTab('adspy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'adspy'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>2. Ad Spy</span>
          </button>

          <button
            onClick={() => onSelectTab('telegram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'telegram'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>3. Copilot</span>
          </button>

          <button
            onClick={() => onSelectTab('connections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'connections'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Channels</span>
          </button>
        </div>

        {/* Live Status & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'autoboost' && (
            <>
              {/* Trigger Scan */}
              <button
                onClick={onScan}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                title="Scan organic post metrics via Zernio /v1/posts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-brand-500' : ''}`} />
                <span className="hidden md:inline">{isScanning ? 'Scanning...' : 'Scan Posts'}</span>
              </button>

              {/* Simulate Breakout */}
              <button
                onClick={onSimulateBreakout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition shadow-sm"
                title="Simulate sudden viral spike on organic post"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="hidden md:inline">Simulate Breakout</span>
              </button>
            </>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Key Settings */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="Configure Zernio API Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Zernio Synced Accounts Banner */}
      <div className="bg-slate-100/90 dark:bg-[#070b14] border-t border-slate-200/90 dark:border-slate-800/80 px-4 py-1.5 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-[11px]">Live Zernio Sync:</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Profile Default (Connected)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] overflow-x-auto">
            {/* Twitter */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-sky-500 dark:text-sky-400 font-bold">𝕏</span>
              <span className="font-semibold">{twitterAcc?.username ? `@${twitterAcc.username}` : '@connected_lead'}</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
            </span>

            {/* Meta Ads */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-blue-600 dark:text-blue-400 font-bold">Ⓜ️</span>
              <span className="font-semibold">{metaAcc?.displayName || 'Meta Ads'}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">(Ad Engine Synced)</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">● Connected</span>
            </span>

            {/* WhatsApp */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">💬</span>
              <span className="font-semibold">{waAcc?.displayName || 'WhatsApp'}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">(Cloud API)</span>
            </span>

            <button
              onClick={() => onSelectTab('connections')}
              className="text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold ml-1 hover:underline flex items-center gap-1"
            >
              <span>Manage Channels →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#121827] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500 dark:text-brand-400" />
              Zernio API Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your API key is used directly to authenticate calls against <code className="text-brand-600 dark:text-brand-300">https://zernio.com/api/v1</code>.
            </p>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-brand-500 mb-4"
              placeholder="sk_..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md shadow-brand-500/20"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
