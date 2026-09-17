import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ControlTower } from './components/ControlTower';
import { TurboPet } from './components/TurboPet';
import { FulfillmentCard } from './components/FulfillmentCard';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import {
  KnowledgeView,
  InventoryView,
  POsView,
  GovernanceView,
  AuditTrailView,
} from './components/Views';
import { QUICK_PROMPTS, evaluateQuery } from './data/mockData';
import { ChatMessage, DecisionResult } from './types';
import {
  Send,
  Sparkles,
  Menu,
  Eye,
  EyeOff,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isControlTowerRetracted, setIsControlTowerRetracted] = useState<boolean>(false);
  const [isPetRetracted, setIsPetRetracted] = useState<boolean>(false);
  const [selectedEvidence, setSelectedEvidence] = useState<DecisionResult | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      time: '09:00 AM',
      content:
        '👋 Welcome to DealerBRAIN Agentic Stock Rescue! I am your after-sales logistics copilot, powered by deterministic master records from after_sales.xlsx.\n\nAsk me about purchase orders, network stock availability across Frankfurt and Pune depots, or any of our 25 operational policies (e.g. KB-019 Claim Rejections or KB-009 Suspended Dealers).',
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const decision = evaluateQuery(text);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: decision.summary,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: decision,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 450);
  };

  const handleSimulateApproval = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, simulatedApproved: true } : msg))
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          'Chat history cleared. DealerBRAIN and Turbo are standing by for your next after-sales inquiry.',
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#070e1b] font-sans text-slate-100 antialiased">
      {/* Retractable Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0b162a]/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">DealerBRAIN</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                Agentic Stock Rescue
              </span>
            </div>
          </div>

          {/* Controls: Zen Focus & Clear */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsZenMode(!isZenMode)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isZenMode
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {isZenMode ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{isZenMode ? '🧘 Zen Focus (Active)' : '🧘 Zen Focus Mode'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              title="Reset Chat Session"
              className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-5xl">
            {activeTab === 'chat' && (
              <div>
                {/* Control Tower (Hidden in Zen Mode) */}
                {!isZenMode && (
                  <ControlTower
                    isRetracted={isControlTowerRetracted}
                    onToggleRetract={() => setIsControlTowerRetracted(!isControlTowerRetracted)}
                  />
                )}

                {/* Turbo Mascot */}
                <TurboPet
                  currentQuip={messages[messages.length - 1]?.result?.turboQuip}
                  isRetracted={isPetRetracted}
                  onToggleRetract={() => setIsPetRetracted(!isPetRetracted)}
                />

                {/* Quick Prompts */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Quick Guided Inquiries
                    </span>
                    <span className="text-[11px] text-slate-500">1-click verified scenarios</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="truncate rounded-xl border border-slate-800 bg-[#101e38]/70 px-3 py-2 text-left text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/50 hover:bg-[#152747] hover:text-white"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Stream */}
                <div className="space-y-4 mb-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                            : 'border border-slate-800 bg-[#0f1d35]/90 text-slate-200 rounded-bl-none shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                          <span className="font-bold flex items-center gap-1">
                            {msg.role === 'user' ? 'You (Logistics Manager)' : '🤖 DealerBRAIN Copilot'}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                        {/* Result Card */}
                        {msg.result && (
                          <FulfillmentCard
                            result={msg.result}
                            isSimulatedApproved={msg.simulatedApproved}
                            onSimulateApproval={() => handleSimulateApproval(msg.id)}
                            onOpenEvidence={() => setSelectedEvidence(msg.result!)}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Thinking Spinner */}
                  {isThinking && (
                    <div className="flex items-center gap-3 text-xs text-cyan-400 p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 w-fit">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
                      <span>Turbo is inspecting inventory bins and verifying governance policies…</span>
                    </div>
                  )}
                </div>

                {/* Chat Input Box */}
                <div className="sticky bottom-0 rounded-2xl border border-slate-800 bg-[#0c182b]/95 p-2 shadow-2xl backdrop-blur-md">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about PO-2026-1001, policy KB-019, or part P-10036 stock..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isThinking}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all"
                    >
                      <span>Send</span>
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'pos' && (
              <POsView
                onSelectPrompt={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                onSelectPrompt={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeView
                onSelectPrompt={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
              />
            )}

            {activeTab === 'governance' && <GovernanceView />}

            {activeTab === 'audit' && <AuditTrailView />}
          </div>
        </main>
      </div>

      {/* Evidence Drawer Modal */}
      <EvidenceDrawer
        result={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}

export default App;
