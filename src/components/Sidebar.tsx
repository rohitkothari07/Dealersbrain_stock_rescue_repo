import React from 'react';
import {
  MessageSquare,
  ShoppingCart,
  Boxes,
  BookOpen,
  ShieldAlert,
  FileCheck,
  X,
  Database,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: 'chat', label: 'Copilot Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'pos', label: 'Purchase Orders', icon: ShoppingCart, count: '147' },
    { id: 'inventory', label: 'Network Inventory', icon: Boxes, count: '82' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, count: '25' },
    { id: 'governance', label: 'Governance Rules', icon: ShieldAlert, count: '4' },
    { id: 'audit', label: 'POC Audit Trail', icon: FileCheck },
  ];

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#091424] p-4 text-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-lg shadow-blue-500/30">
              DB
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-wide">DealerBRAIN</div>
              <div className="text-[10px] text-cyan-400 font-semibold">After-Sales Logistics AI</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="mt-4 flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mascot: Turbo Kennel */}
        <div className="mb-3 rounded-xl border border-cyan-500/25 bg-[#0f2038] p-3 text-xs">
          <div className="flex items-center justify-between font-bold text-amber-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>🐾</span> Mascot: Turbo
            </span>
            <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-300">
              Active
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center justify-between text-slate-400">
              <span>Duty:</span>
              <span className="text-white font-medium">Stock Rescue Hound</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Sniffs:</span>
              <span className="text-cyan-300 font-mono">82 Bins & 147 POs</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Treat Level:</span>
              <span className="text-emerald-400 font-bold">Satisfied 🦴</span>
            </div>
          </div>
        </div>

        {/* Dataset Information Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c1b30] p-3 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              Source Dataset
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">486 Rows</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 truncate">data/after_sales.xlsx</div>
          <div className="mt-2 text-[10px] text-slate-400">
            Read-only operational master verified against sha256 checksum.
          </div>
        </div>
      </aside>
    </>
  );
};
