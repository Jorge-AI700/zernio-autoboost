import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { BoostResponse } from '../types';

interface ApiTerminalProps {
  lastResponse: BoostResponse | null;
}

export const ApiTerminal: React.FC<ApiTerminalProps> = ({ lastResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!lastResponse) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(lastResponse.rawResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-lg shadow-2xl transition-all duration-300">
      {/* Bar Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <Terminal className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              POST /v1/ads/boost → 201 Created
            </span>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Campaign: <code className="text-emerald-600 dark:text-emerald-400 font-mono">{lastResponse.campaignId}</code> | AdSet: <code className="text-sky-600 dark:text-sky-400 font-mono">{lastResponse.adSetId}</code> | Ad: <code className="text-amber-600 dark:text-amber-400 font-mono">{lastResponse.adId}</code>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <span className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {/* Expanded Terminal Panel */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 border-t border-slate-200 dark:border-slate-800/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Payload */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                <span>Request Payload (Zernio OpenAPI Schema)</span>
                <span className="text-brand-600 dark:text-brand-400">POST https://zernio.com/api/v1/ads/boost</span>
              </div>
              <pre className="p-3 bg-slate-900 dark:bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-100 dark:text-slate-300 max-h-56 overflow-y-auto">
                {JSON.stringify(lastResponse.livePayloadSent, null, 2)}
              </pre>
            </div>

            {/* Response Payload */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                <span>Response Hierarchy</span>
                <span className="text-emerald-600 dark:text-emerald-400">Status: 201 Created</span>
              </div>
              <pre className="p-3 bg-slate-900 dark:bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 dark:text-emerald-300 max-h-56 overflow-y-auto">
                {JSON.stringify(lastResponse.rawResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
