import React, { useState } from 'react';
import { KNOWLEDGE_BASE } from '../data/mockData';
import {
  Search,
  BookOpen,
  Package,
  ClipboardList,
  Shield,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface ViewsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const KnowledgeView: React.FC<ViewsProps> = ({ onSelectPrompt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filtered = KNOWLEDGE_BASE.filter((k) => {
    const matchesSearch =
      k.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.module && k.module.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === 'ALL' || (k.docType && k.docType.toUpperCase() === selectedType);

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">After-Sales Knowledge Base</h2>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
              {KNOWLEDGE_BASE.length} Operational Docs
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Policies, SOPs, FAQs, and error codes extracted from the operational dataset.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search KB-019, warranty, claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {['ALL', 'POLICY', 'SOP', 'FAQ', 'ERRORCODE'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              selectedType === type
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {type === 'ALL' ? 'All Types' : type}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-[#101f37]/80 p-4 transition-all hover:border-slate-700 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300 border border-cyan-500/20">
                    {item.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {item.docType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPrompt(`What is policy ${item.id}?`)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-200"
                >
                  Ask <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-3">{item.excerpt}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Module: {item.module}</span>
              <span>{item.ownerTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InventoryView: React.FC<ViewsProps> = ({ onSelectPrompt }) => {
  const inventoryItems = [
    {
      partNo: 'P-10004',
      name: 'Cooling Filter 710',
      location: 'Frankfurt Regional Hub (WH-EU-FRA · E12-1)',
      onHand: 120,
      reserved: 5,
      available: 115,
      status: 'Ready',
    },
    {
      partNo: 'P-10036',
      name: 'Steering Joint Assembly',
      location: 'Frankfurt Hub & Pune Logistics Depot',
      onHand: 4,
      reserved: 0,
      available: 4,
      status: 'Low Stock',
    },
    {
      partNo: 'P-10022',
      name: 'Transmission Seal Ring',
      location: 'Pune Depot (WH-IN-PUN · B-12)',
      onHand: 95,
      reserved: 0,
      available: 95,
      status: 'Ready',
    },
    {
      partNo: 'P-10043',
      name: 'Electronic Control Module',
      location: 'Wolfsburg Yard (WH-DE-WOL · A-04)',
      onHand: 0,
      reserved: 0,
      available: 0,
      status: 'Depleted',
    },
    {
      partNo: 'P-10006',
      name: 'Air Intake Duct Anomaly',
      location: 'Pune Depot (WH-IN-PUN · B-03)',
      onHand: 0,
      reserved: 8,
      available: -8,
      status: 'Negative Stock (ERR-INV-002)',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Network Inventory Explorer</h2>
          <p className="text-xs text-slate-400">
            82 physical warehouse records across European and Indian regional depots.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#101f37]/80">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="border-b border-slate-800 bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="p-3">Part No & Description</th>
              <th className="p-3">Depot Location</th>
              <th className="p-3 text-right">On Hand</th>
              <th className="p-3 text-right">Available</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {inventoryItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="p-3 font-sans">
                  <div className="font-bold text-white font-mono">{item.partNo}</div>
                  <div className="text-[11px] text-slate-400">{item.name}</div>
                </td>
                <td className="p-3 text-slate-300">{item.location}</td>
                <td className={`p-3 text-right ${item.onHand < 0 ? 'text-rose-400 font-bold' : ''}`}>
                  {item.onHand}
                </td>
                <td
                  className={`p-3 text-right font-bold ${
                    item.available < 0
                      ? 'text-rose-400'
                      : item.available === 0
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {item.available}
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectPrompt(`Show stock for part ${item.partNo}`)}
                    className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    Check Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const POsView: React.FC<ViewsProps> = ({ onSelectPrompt }) => {
  const purchaseOrders = [
    {
      poId: 'PO-2026-1001',
      dealer: 'D006 · Detroit Motors (Active)',
      part: 'P-10004',
      qty: 12,
      status: 'FULLY FULFILLABLE',
      note: '115 units available in Frankfurt Hub · 100% Demand Ready',
    },
    {
      poId: 'PO-2026-1026',
      dealer: 'D001 · Detroit Central (Active)',
      part: 'P-10036',
      qty: 10,
      status: 'PARTIALLY FULFILLABLE',
      note: '4 units available in network · 6 units unresolved shortage',
    },
    {
      poId: 'PO-2026-1106',
      dealer: 'D007 · Chennai Motors (SUSPENDED)',
      part: 'P-10020',
      qty: 4,
      status: 'BLOCKED',
      note: 'Account Suspended · Hard Blocked under Governance KB-009',
    },
    {
      poId: 'PO-2026-1004',
      dealer: 'D021 · Tokyo Parts Center (Active)',
      part: 'P-10043',
      qty: 2,
      status: 'STOCKOUT',
      note: '0 units available in network · Backorder required (KB-014)',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Purchase Orders Pipeline</h2>
        <p className="text-xs text-slate-400">
          147 validated orders (PO-2026-1001 to PO-2026-1109) evaluated against stock and compliance.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {purchaseOrders.map((po) => (
          <div
            key={po.poId}
            className="rounded-xl border border-slate-800 bg-[#101f37]/80 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{po.poId}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    po.status === 'BLOCKED'
                      ? 'bg-rose-500/20 text-rose-300'
                      : po.status === 'FULLY FULFILLABLE'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : po.status === 'STOCKOUT'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {po.status}
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-300">{po.dealer}</div>
              <div className="mt-1 text-xs text-slate-400">
                Part: <b className="font-mono text-white">{po.part}</b> (Qty: {po.qty})
              </div>
              <div className="mt-2 text-[11px] text-slate-400 italic leading-relaxed">"{po.note}"</div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPrompt(`Can ${po.poId} be fulfilled?`)}
              className="mt-3 w-full rounded-lg bg-cyan-600/20 border border-cyan-500/30 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition-colors text-center"
            >
              Analyze in Copilot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GovernanceView: React.FC = () => {
  const rules = [
    {
      id: 'GOV-01',
      title: 'Deterministic Allocation Priority',
      desc: 'Prioritize lowest-transit-cost depot (Frankfurt < Munich < Pune) with zero negative allocations.',
    },
    {
      id: 'GOV-02',
      title: 'Air Freight Hazmat Restrictions',
      desc: 'Lithium battery modules and volatile brake fluids cannot ship via standard air cargo (ref: KB-017).',
    },
    {
      id: 'GOV-03',
      title: 'Suspended Dealer Account Lock',
      desc: 'Zero parts can be reserved or shipped to dealers with SUSPENDED finance status (ref: KB-009).',
    },
    {
      id: 'GOV-04',
      title: 'Human POC Verification Gate',
      desc: 'AI suggestions are read-only until authorized by an authenticated logistics manager.',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Governance & Operational Policies</h2>
        <p className="text-xs text-slate-400">Hard constraints enforced deterministically on all AI Copilot interactions.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-slate-800 bg-[#101f37]/80 p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-cyan-300">{rule.id}</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-white">{rule.title}</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AuditTrailView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">POC Simulated Audit Trail</h2>
        <p className="text-xs text-slate-400">Log of simulated fulfillment approvals and governance checks.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#101f37]/80 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white">Simulation: PO-2026-1026 Partial Allocation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Allocated 2 units from Frankfurt Hub + 2 units from Pune Depot. Deficit: 6 units.
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-1">
              Status: Human Confirmed POC_SIMULATED · Read-Only Master Safe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
