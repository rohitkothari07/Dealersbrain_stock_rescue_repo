import React from 'react';
import { DecisionResult } from '../types';
import { X, CheckCircle, Database, ShieldAlert } from 'lucide-react';

interface EvidenceDrawerProps {
  result: DecisionResult | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-[#0a1527] p-5 text-slate-100 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                {result.tool}
              </span>
              <h2 className="text-base font-bold text-white">Deterministic Evidence Trace</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Verified ground-truth records from data/after_sales.xlsx
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action & Tool badge */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-[#0f2038] p-3 text-xs">
          <div className="font-semibold text-slate-300">Action: {result.action}</div>
          <div className="text-[11px] text-cyan-300 font-mono mt-0.5">Tool ID: {result.tool}</div>
        </div>

        {/* Evidence Table */}
        {result.evidence && result.evidence.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              Direct Excel Row Citations
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c182b]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400">
                  <tr>
                    {Object.keys(result.evidence[0]).map((key) => (
                      <th key={key} className="p-2.5">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {result.evidence.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-2.5 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Issues List */}
        {result.issues && result.issues.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              Governance & Risk Flags
            </h3>
            <div className="space-y-2">
              {result.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-200"
                >
                  <div className="font-bold font-mono text-[11px]">{issue.code}</div>
                  <div className="mt-0.5 text-slate-300">{issue.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Turbo note */}
        <div className="mt-auto pt-6">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-200 flex items-center gap-2">
            <span className="text-base">🐶</span>
            <span className="italic">{result.turboQuip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
