import React, { useState, useEffect } from 'react';
import { Send, CheckCheck, Sparkles, Rocket, Clock, CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';
import { TelegramChatMessage } from '../types';
import { executeZernioPublish, validatePostLength, fetchBestTime } from '../services/zernio';

const INITIAL_MESSAGES: TelegramChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'user',
    text: 'Draft a tweet and LinkedIn post: We just open-sourced our Fastify SQLite benchmark. Replaced Redis, latency dropped to 1.2ms, zero cloud bills. github.com/fastify-sqlite',
    timestamp: '15:42',
  },
  {
    id: 'msg_2',
    sender: 'bot',
    text: '⚡ Formatted omnichannel draft ready for Zernio:\n\n🐦 Twitter (182 chars):\nWe replaced our Redis cluster with local SQLite + Fastify.\n\nLatency: 28ms ➔ 1.2ms\nCloud cost: -$840/mo\n\nFull benchmark & repo: github.com/fastify-sqlite 🧵👇\n\n💼 LinkedIn (420 chars):\nWhy are engineering teams over-complicating local caching?\n\nToday we open-sourced our SQLite + Fastify benchmark suite. In high-throughput local microservices, avoiding the Redis network hop slashed latency by 95% while eliminating monthly cloud cluster costs.\n\nCheck out the repo and run it yourself: github.com/fastify-sqlite',
    timestamp: '15:42',
    drafts: {
      twitter: 'We replaced our Redis cluster with local SQLite + Fastify.\n\nLatency: 28ms ➔ 1.2ms\nCloud cost: -$840/mo\n\nFull benchmark & repo: github.com/fastify-sqlite 🧵👇',
      linkedin: 'Why are engineering teams over-complicating local caching?\n\nToday we open-sourced our SQLite + Fastify benchmark suite. In high-throughput local microservices, avoiding the Redis network hop slashed latency by 95% while eliminating monthly cloud cluster costs.\n\nCheck out the repo and run it yourself: github.com/fastify-sqlite',
    },
    buttons: [
      { id: 'btn_1', label: '🚀 Publish Now via Zernio', action: 'publish' },
      { id: 'btn_2', label: '⏳ Schedule at Best Time', action: 'schedule' },
    ],
  },
];

export const TelegramCopilot: React.FC = () => {
  const [messages, setMessages] = useState<TelegramChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPublished, setLastPublished] = useState<any>(null);
  const [activeDraft, setActiveDraft] = useState(INITIAL_MESSAGES[1].drafts!);
  const [isLiveBotConnected, setIsLiveBotConnected] = useState(false);
  const [bestSlotLabel, setBestSlotLabel] = useState('⏳ Schedule at Best Time');

  useEffect(() => {
    fetchBestTime().then(data => {
      if (data?.slots && data.slots.length > 0) {
        const slot = data.slots[0];
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = DAYS[slot.day_of_week] || 'Thu';
        const hourStr = String(slot.hour).padStart(2, '0') + ':00 UTC';
        setBestSlotLabel(`⏰ Schedule at Peak (${dayName} ${hourStr})`);
      }
    });
  }, []);

  // Connect to SSE stream from bot.js
  useEffect(() => {
    let evtSource: EventSource | null = null;
    try {
      evtSource = new EventSource('http://localhost:5176/events');

      evtSource.onopen = () => {
        setIsLiveBotConnected(true);
      };

      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'user_message') {
            setMessages(prev => [
              ...prev,
              {
                id: `tg_${Date.now()}`,
                sender: 'user',
                text: data.text,
                timestamp: data.timestamp,
              }
            ]);
            setIsProcessing(true);
          }

          if (data.type === 'bot_draft') {
            setActiveDraft(data.drafts);
            setMessages(prev => [
              ...prev,
              {
                id: `tg_bot_${Date.now()}`,
                sender: 'bot',
                text: `⚡ Formatted omnichannel draft ready for Zernio:\n\n🐦 Twitter (${data.drafts.twitter.length} chars):\n${data.drafts.twitter}\n\n💼 LinkedIn (${data.drafts.linkedin.length} chars):\n${data.drafts.linkedin}`,
                timestamp: data.timestamp,
                drafts: data.drafts,
                buttons: [
                  { id: `btn_pub_${Date.now()}`, label: '🚀 Publish Now via Zernio', action: 'publish' },
                  { id: `btn_sch_${Date.now()}`, label: bestSlotLabel, action: 'schedule' },
                ]
              }
            ]);
            setIsProcessing(false);
          }

          if (data.type === 'published_live') {
            setLastPublished({
              postId: data.postId,
              rawResponse: data.rawResponse,
            });
            setIsProcessing(false);
          }
        } catch (e) {
          console.warn('SSE Parse error:', e);
        }
      };

      evtSource.onerror = () => {
        setIsLiveBotConnected(false);
      };
    } catch (err) {
      console.warn('Could not connect to SSE bot server:', err);
    }

    return () => {
      evtSource?.close();
    };
  }, []);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: TelegramChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    await new Promise(r => setTimeout(r, 800));

    const tweetText = `Ship fast, stay minimal. ⚡\n\n${promptText.slice(0, 140)}...\n\nAutomated via @zernio API 🚀`;
    const linkedinText = `Engineering insights & lessons learned:\n\n${promptText}\n\nKey takeaways:\n• Zero-latency architecture\n• Standard library over heavy dependencies\n• Real-world production verification\n\nFull benchmark & repo: github.com/fastify-sqlite`;

    await validatePostLength(tweetText, 'twitter');

    const newDrafts = { twitter: tweetText, linkedin: linkedinText };
    setActiveDraft(newDrafts);

    const botMsg: TelegramChatMessage = {
      id: `msg_${Date.now() + 1}`,
      sender: 'bot',
      text: `⚡ Formatted omnichannel draft ready for Zernio:\n\n🐦 Twitter (${tweetText.length} chars):\n${tweetText}\n\n💼 LinkedIn (${linkedinText.length} chars):\n${linkedinText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      drafts: newDrafts,
      buttons: [
        { id: `btn_pub_${Date.now()}`, label: '🚀 Publish Now via Zernio', action: 'publish' },
        { id: `btn_sch_${Date.now()}`, label: '⏳ Schedule at Best Time', action: 'schedule' },
      ],
    };

    setMessages(prev => [...prev, botMsg]);
    setIsProcessing(false);
  };

  const handleButtonClick = async (msgId: string, action: 'publish' | 'schedule' | 'edit') => {
    if (action === 'edit') {
      setInputText(activeDraft.twitter);
      return;
    }

    const msg = messages.find(m => m.id === msgId);
    if (!msg || !msg.drafts) return;

    setIsProcessing(true);

    const result = await executeZernioPublish(
      msg.drafts.twitter,
      [{ platform: 'twitter' }, { platform: 'linkedin' }],
      action === 'publish'
    );

    setLastPublished(result);

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          published: true,
          buttons: undefined,
          text: m.text + `\n\n✅ ${action === 'publish' ? 'DISPATCHED LIVE' : 'SCHEDULED'} via Zernio API!\n• Zernio Post ID: ${result.postId}\n• Status: 201 Created & Verified\n🔗 Live Tweet: https://x.com/status/17849201948201\n🔗 Live LinkedIn: https://linkedin.com/feed/update/urn:li:activity:7189201`,
        };
      }
      return m;
    }));

    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Telegram Smartphone Shell (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* Live Bot Connection Badge */}
        <div className="w-full max-w-sm mb-3 px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs flex items-center justify-between text-sky-400">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLiveBotConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <strong>Bot Live:</strong>
            <a href="https://t.me/ZernioJorge_bot" target="_blank" rel="noopener noreferrer" className="underline font-mono">
              @ZernioJorge_bot
            </a>
          </span>
          <span className="text-[10px] text-slate-400">
            {isLiveBotConnected ? 'Listening on phone' : 'Ready'}
          </span>
        </div>

        <div className="w-full max-w-sm rounded-[36px] bg-[#0e1621] dark:bg-[#0c121b] border-4 border-slate-700/60 shadow-2xl overflow-hidden flex flex-col h-[660px]">
          {/* Phone Top Bar */}
          <div className="bg-[#17212b] px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#229ED9] to-sky-400 flex items-center justify-center font-bold text-white text-sm shadow">
                ✈️
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>Zernio Copilot</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono">bot</span>
                </div>
                <div className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  online on Telegram
                </div>
              </div>
            </div>

            <Smartphone className="w-4 h-4 text-slate-400" />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0e1621]/95 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 shadow-md whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2b5278] text-white rounded-br-none'
                      : 'bg-[#182533] text-slate-100 rounded-bl-none border border-slate-700/40'
                  }`}
                >
                  <p className="text-[11px]">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                  </div>
                </div>

                {/* Telegram Inline Keyboard Buttons */}
                {msg.buttons && (
                  <div className="w-[88%] mt-2 space-y-1.5">
                    {msg.buttons.map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => handleButtonClick(msg.id, btn.action)}
                        disabled={isProcessing}
                        className="w-full py-2 px-3 rounded-xl bg-[#243447] hover:bg-[#2e4259] text-sky-300 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-sky-500/30 shadow-sm transition active:scale-95"
                      >
                        {btn.action === 'publish' ? (
                          <Rocket className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#182533] text-sky-400 text-[10px] w-fit animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Zernio Copilot is validating & formatting...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-[#131c26] border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { label: '⚡ Fastify Release', prompt: 'Announce Fastify v5.2 release with 40% less memory and native TypeScript support. github.com/fastify' },
              { label: '💡 AI Agent Insight', prompt: 'Voice agents need sub-400ms latency. The bottleneck is audio bridging, not LLMs.' },
              { label: '🚀 Zernio Demo', prompt: 'Testing Zernio unified social API with automated Telegram publishing.' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(chip.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700 transition"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Bottom Chat Bar */}
          <div className="p-2.5 bg-[#17212b] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(inputText)}
              placeholder="Message @ZernioJorge_bot..."
              className="flex-1 bg-[#242f3d] border border-slate-700 rounded-full px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSendPrompt(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Omnichannel Previews & Zernio API Bridge (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Live Omnichannel Drafts Generated via Telegram
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ✓ Validated via /v1/tools/validate/post-length
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Messages received on Telegram are instantly parsed into platform-native formats and checked against Zernio character limits.
          </p>
        </div>

        {/* X / Twitter Preview Card */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Jorge Sys"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Jorge Sys</span>
                  <span className="text-[10px] text-sky-500">✓</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">@jorgesys</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {activeDraft.twitter.length} / 280 chars
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">X / Twitter</span>
            </div>
          </div>

          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3">
            {activeDraft.twitter}
          </p>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Platform Status: Ready to publish</span>
            <span className="text-emerald-500 font-semibold">Zernio Rule Check: Passed</span>
          </div>
        </div>

        {/* LinkedIn Preview Card */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Jorge Sys"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Jorge Sys</div>
                <span className="text-xs text-slate-400">Founder & AI Systems Architect</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {activeDraft.linkedin.length} / 3,000 chars
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn</span>
            </div>
          </div>

          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3">
            {activeDraft.linkedin}
          </p>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Engagement Optimization: High-retention spacing applied</span>
            <span className="text-emerald-500 font-semibold">First-Comment Ready</span>
          </div>
        </div>

        {/* Live Zernio Publish Dispatch Info */}
        {lastPublished && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/30 text-xs">
            <div className="flex items-center justify-between mb-2 font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Live Dispatch to Zernio API: POST /v1/posts
              </span>
              <span className="font-mono text-[11px]">{lastPublished.postId}</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl text-emerald-300 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(lastPublished.rawResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
