import React from 'react';
import { Database, AlertTriangle, Layers, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';

interface ControlTowerProps {
  isRetracted?: boolean;
  onToggleRetract?: () => void;
}

export const ControlTower: React.FC<ControlTowerProps> = ({
  isRetracted = false,
  onToggleRetract,
}) => {
  return (
    <div className="mb-4 rounded-2xl border border-slate-800 bg-[#0c182b]/90 p-3.5 shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="font-extrabold text-xs text-white uppercase tracking-wider">
            Operational Control Tower
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
            Active Master
          </span>
        </div>

        {onToggleRetract && (
          <button
            type="button"
            onClick={onToggleRetract}
            className="rounded-lg border border-slate-700 bg-slate-800/80 p-1 text-slate-400 hover:text-white"
            title={isRetracted ? 'Expand Metrics' : 'Collapse Metrics'}
          >
            {isRetracted ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {!isRetracted && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold">
              <span>Operational Sheets</span>
              <Database className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="mt-1 text-xl font-black text-white">8</div>
            <div className="text-[10px] text-slate-400">POs, Parts, Inventory, KB</div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold">
              <span>Synchronized Rows</span>
              <Layers className="h-3 w-3 text-blue-400" />
            </div>
            <div className="mt-1 text-xl font-black text-white">486</div>
            <div className="text-[10px] text-slate-400">Across 24 Global Dealers</div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5">
            <div className="flex items-center justify-between text-amber-300 text-[10px] font-semibold">
              <span>Risk Anomalies</span>
              <AlertTriangle className="h-3 w-3 text-amber-400" />
            </div>
            <div className="mt-1 text-xl font-black text-amber-300">2</div>
            <div className="text-[10px] text-amber-400/80">1 Suspended Dealer · 1 Neg Stock</div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5">
            <div className="flex items-center justify-between text-emerald-300 text-[10px] font-semibold">
              <span>Governance State</span>
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="mt-1 text-xl font-black text-emerald-300">Deterministic</div>
            <div className="text-[10px] text-emerald-400/80">Human-in-the-Loop Gate</div>
          </div>
        </div>
      )}
    </div>
  );
};
