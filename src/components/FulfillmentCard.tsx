import React from 'react';
import { DecisionResult } from '../types';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Eye,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface FulfillmentCardProps {
  result: DecisionResult;
  onSimulateApproval?: () => void;
  isSimulatedApproved?: boolean;
  onOpenEvidence?: () => void;
}

export const FulfillmentCard: React.FC<FulfillmentCardProps> = ({
  result,
  onSimulateApproval,
  isSimulatedApproved,
  onOpenEvidence,
}) => {
  const { status, fulfillment, stocks, turboQuip, knowledge, dealers, issues, action } = result;

  const isFull = status === 'FULLY_FULFILLABLE';
  const isPartial = status === 'PARTIALLY_FULFILLABLE';
  const isBlocked = status === 'BLOCKED';
  const isNoStock = status === 'NO_STOCK';
  const isKnowledge = knowledge && knowledge.length > 0;

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-[#12223c]/90 text-slate-100 shadow-xl">
      {/* Banner / Status Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 ${
          isFull
            ? 'bg-emerald-950/70 border-b border-emerald-500/30'
            : isPartial
            ? 'bg-amber-950/70 border-b border-amber-500/30'
            : isBlocked
            ? 'bg-rose-950/70 border-b border-rose-500/30'
            : isNoStock
            ? 'bg-red-950/70 border-b border-red-500/30'
            : isKnowledge
            ? 'bg-cyan-950/60 border-b border-cyan-500/30'
            : 'bg-slate-900/80 border-b border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isFull && <CheckCircle className="h-5 w-5 text-emerald-400" />}
          {isPartial && <AlertTriangle className="h-5 w-5 text-amber-400" />}
          {isBlocked && <XCircle className="h-5 w-5 text-rose-400" />}
          {isNoStock && <AlertTriangle className="h-5 w-5 text-red-400" />}
          {isKnowledge && <BookOpen className="h-5 w-5 text-cyan-400" />}
          {!isFull && !isPartial && !isBlocked && !isNoStock && !isKnowledge && (
            <HelpCircle className="h-5 w-5 text-slate-400" />
          )}

          <div>
            <div className="font-extrabold text-sm tracking-wide">
              {isFull && 'FULL FULFILLMENT — 100% Demand Ready'}
              {isPartial && 'PARTIAL FULFILLMENT — Shortage Requires Backorder'}
              {isBlocked && 'GOVERNANCE BLOCKED — Compliance Hold'}
              {isNoStock && 'STOCKOUT — 0 Units Available in Network'}
              {isKnowledge && `OPERATIONAL POLICY VERIFIED · ${knowledge[0].id}`}
              {!isFull && !isPartial && !isBlocked && !isNoStock && !isKnowledge && action}
            </div>
            <div className="text-xs text-slate-300">
              {fulfillment ? (
                `${fulfillment.plannedFulfillmentQty} of ${fulfillment.requestedQty} units allocated across network depots.`
              ) : isKnowledge ? (
                `${knowledge[0].title} · Department: ${knowledge[0].ownerTeam || 'After-Sales Ops'}`
              ) : isBlocked && dealers && dealers.length > 0 ? (
                `Account ${dealers[0].dealerId} is SUSPENDED · Compliance Rule GOV-03`
              ) : (
                action || 'Deterministic Knowledge & Inventory Engine'
              )}
            </div>
          </div>
        </div>

        {onOpenEvidence && (
          <button
            type="button"
            onClick={onOpenEvidence}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Inspect Evidence Trace
          </button>
        )}
      </div>

      {/* 1. Fulfillment Plan Content */}
      {fulfillment && (
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="text-2xl font-black text-white">{fulfillment.requestedQty}</div>
              <div className="text-xs font-semibold text-slate-400">Requested Qty</div>
              <div className="text-[10px] text-slate-500">for {fulfillment.poId}</div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="text-2xl font-black text-emerald-400">{fulfillment.plannedFulfillmentQty}</div>
              <div className="text-xs font-semibold text-slate-400">Planned Qty</div>
              <div className="text-[10px] text-slate-500">{fulfillment.networkAvailableQty} network available</div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="text-2xl font-black text-rose-400">{fulfillment.unresolvedRemainingQty}</div>
              <div className="text-xs font-semibold text-slate-400">Unresolved Qty</div>
              <div className="text-[10px] text-rose-400/80">
                {fulfillment.unresolvedRemainingQty > 0 ? 'shortage requires PO' : 'zero shortage'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="text-xs font-bold text-cyan-300 mb-1">Allocation Plan</div>
              {fulfillment.allocations.length > 0 ? (
                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  {fulfillment.allocations.map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="truncate">{a.sourceLocation.split('(')[0].trim()}:</span>
                      <span className="font-bold text-emerald-400">{a.proposedQty} units</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-rose-400">0 bins available</div>
              )}
            </div>
          </div>

          {/* Stock Details */}
          {stocks && stocks.length > 0 && (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
              <div className="font-semibold text-slate-300 mb-2">Network Inventory Breakdown · {stocks[0].partNo}</div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded bg-slate-800/50 p-2">
                  <div className="text-slate-400 text-[10px]">Requested</div>
                  <div className="font-bold text-white">{stocks[0].requestedQty}</div>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <div className="text-slate-400 text-[10px]">Available</div>
                  <div className="font-bold text-emerald-400">{stocks[0].availableQty}</div>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <div className="text-slate-400 text-[10px]">Deficit</div>
                  <div className={`font-bold ${stocks[0].deficitQty > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {stocks[0].deficitQty}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Turbo's Funny Pet Field Note */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-slate-200">
            <span className="text-base flex-shrink-0">🐶</span>
            <div>
              <span className="font-bold text-cyan-300">Turbo's Field Note: </span>
              <span className="italic">{turboQuip}</span>
            </div>
          </div>

          {/* Simulated POC Authorization Button */}
          {onSimulateApproval && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                POC Mode: Humans authorize consequential actions before ERP execution.
              </div>
              <button
                type="button"
                onClick={onSimulateApproval}
                disabled={isSimulatedApproved}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
                  isSimulatedApproved
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-blue-600/30'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                {isSimulatedApproved ? '✓ Simulated Fulfillment Authorized & Logged' : 'Authorize Simulated POC Fulfillment'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Knowledge Document Card */}
      {isKnowledge && knowledge && (
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                  {knowledge[0].id}
                </span>
                <span className="font-semibold text-white text-sm">{knowledge[0].title}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-cyan-400">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                  {knowledge[0].docType || 'Operational Policy'}
                </span>
                <span>Module: {knowledge[0].module || 'After-Sales'}</span>
              </div>
            </div>

            <div className="text-slate-200 leading-relaxed font-sans mb-3">
              {knowledge[0].excerpt}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Owner Team: <strong className="text-slate-200">{knowledge[0].ownerTeam || 'After-Sales Ops'}</strong></span>
              </div>
              {knowledge[0].lastUpdated && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Verified: {knowledge[0].lastUpdated}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-slate-200">
            <span className="text-base flex-shrink-0">🐶</span>
            <div>
              <span className="font-bold text-cyan-300">Turbo's Knowledge Fetch: </span>
              <span className="italic">{turboQuip}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Blocked Scenario */}
      {isBlocked && (
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs">
            <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Governance Rule Triggered: GOV-03 (Suspended Dealer Account Lock)
            </div>
            <p className="text-slate-300 leading-relaxed">
              {dealers && dealers.length > 0 ? (
                <>
                  Dealer <strong className="text-white">{dealers[0].name} ({dealers[0].dealerId})</strong> has status{' '}
                  <span className="text-rose-400 font-bold">SUSPENDED</span>. Under Operational Policy KB-009, all inventory allocations and outbound dispatches are frozen until compliance and credit controller approval.
                </>
              ) : (
                'Fulfillment blocked due to compliance or governance constraint.'
              )}
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-slate-200">
            <span className="text-base flex-shrink-0">🐶</span>
            <div>
              <span className="font-bold text-cyan-300">Turbo's Guard Post: </span>
              <span className="italic">{turboQuip}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Other Informational Queries */}
      {!fulfillment && !isKnowledge && !isBlocked && (
        <div className="p-5 space-y-4">
          {issues && issues.length > 0 && (
            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 text-xs flex items-start gap-2 ${
                    issue.severity === 'HIGH'
                      ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold font-mono text-[11px]">{issue.code}</div>
                    <div className="mt-0.5 text-slate-300">{issue.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stocks && stocks.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
              <div className="font-semibold text-slate-300 mb-2">Network Inventory Breakdown · {stocks[0].partNo}</div>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="rounded bg-slate-800/50 p-2">
                  <div className="text-slate-400 text-[10px]">Net Available</div>
                  <div className="font-bold text-emerald-400 text-lg">{stocks[0].availableQty}</div>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <div className="text-slate-400 text-[10px]">Status</div>
                  <div className="font-bold text-cyan-300 text-lg">
                    {stocks[0].availableQty > 0 ? 'IN STOCK' : 'DEPLETED'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-slate-200">
            <span className="text-base flex-shrink-0">🐶</span>
            <div>
              <span className="font-bold text-cyan-300">Turbo says: </span>
              <span className="italic">{turboQuip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
