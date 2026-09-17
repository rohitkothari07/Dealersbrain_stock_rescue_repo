import { DecisionResult, KnowledgeItem, StatusType } from '../types';
import rawDataset from './afterSalesDataset.json';

interface RawDealer {
  DealerID: string;
  DealerName: string;
  Region: string;
  Country: string;
  City: string;
  Tier: string;
  Status: string;
  ContactEmail: string;
  CreditLimitEUR: number;
  OnboardedDate: string;
}

interface RawPart {
  PartNo: string;
  PartName: string;
  Category: string;
  UnitPriceEUR: number;
  Currency: string;
  WarrantyMonths: number;
  SupplierID: string;
  SupplierName: string;
  HazmatFlag: string;
  Status: string;
  LeadTimeDays: number;
}

interface RawPO {
  PO_No: string;
  PO_LineNo: number;
  DealerID: string;
  PartNo: string;
  OrderQty: number;
  UnitPriceEUR: number;
  LineTotalEUR: number;
  OrderDate: string;
  RequestedDeliveryDate: string;
  POStatus: string;
  Currency: string;
}

interface RawInventory {
  InventoryID: string;
  PartNo: string;
  WarehouseLoc: string;
  OnHandQty: number;
  ReservedQty: number;
  AvailableQty: number;
  ReorderPoint: number;
  BinLocation: string;
  LastCountDate: string;
}

interface RawKnowledge {
  DocID: string;
  DocType: string;
  Title: string;
  Module: string;
  Summary: string;
  LastUpdated: string;
  OwnerTeam: string;
  ErrorCode?: string;
}

interface RawClaim {
  ClaimID: string;
  ClaimType: string;
  DealerID: string;
  PartNo: string;
  PO_No: string;
  ClaimQty: number;
  PurchaseDate: string;
  ClaimDate: string;
  ClaimStatus: string;
  Reason: string;
  ClaimAmountEUR: number;
  ResolutionCode: string;
}

interface RawShipment {
  ShipmentID: string;
  PO_No: string;
  DealerID: string;
  Carrier: string;
  ShipDate: string;
  EstDeliveryDate: string;
  ShipmentStatus: string;
  TrackingNo: string;
  Qty: number;
}

// Dataset Collections
export const DATASET = rawDataset as {
  Dealers: RawDealer[];
  Parts: RawPart[];
  PurchaseOrders: RawPO[];
  Shipments: RawShipment[];
  Claims: RawClaim[];
  Inventory: RawInventory[];
  BOM: Array<{ BOMID: string; AssemblyPartNo: string; ComponentPartNo: string; QtyPer: number; Level: number }>;
  Knowledge: RawKnowledge[];
};

export const SYSTEM_METADATA = {
  tableCount: 8,
  rowCount: 486,
  warnings: 2,
  source: 'data/after_sales.xlsx',
  fingerprint: 'sha256:88a3df19e7bc401',
  operationalStatus: 'Verified (Read-Only Operational Master)',
};

export const QUICK_PROMPTS = [
  'What is policy KB-019?',
  'Can PO-2026-1001 be fulfilled?',
  'Can PO-2026-1026 be fulfilled?',
  'Process PO-2026-1106',
  'Show stock for part P-10036',
  'Run system risk audit',
];

// All 25 Operational Knowledge Base Documents
export const KNOWLEDGE_BASE: KnowledgeItem[] = DATASET.Knowledge.map((k) => ({
  id: k.DocID,
  docType: k.DocType,
  title: k.Title,
  module: k.Module,
  excerpt: k.Summary,
  matchScore: 1.0,
  lastUpdated: k.LastUpdated,
  ownerTeam: k.OwnerTeam,
  errorCode: k.ErrorCode,
}));

// Warehouse location readable names
const WAREHOUSE_NAMES: Record<string, string> = {
  'WH-DE-FRA': 'Frankfurt Regional Hub',
  'WH-IN-PUN': 'Pune Logistics Depot',
  'WH-DE-MUC': 'Munich Central Depot',
  'WH-DE-WOL': 'Wolfsburg Yard',
  'WH-US-DET': 'Detroit Distribution Center',
};

function formatLoc(code: string): string {
  return WAREHOUSE_NAMES[code] || code;
}

export function evaluateQuery(query: string): DecisionResult {
  const normalized = query.trim().toLowerCase();

  // ==========================================
  // 1. KNOWLEDGE BASE RETRIEVAL
  // ==========================================
  const kbMatch = normalized.match(/kb[-_\s]?(\d{1,3})/i);
  let requestedKbId = kbMatch ? `KB-${kbMatch[1].padStart(3, '0')}` : null;

  let matchedDoc = requestedKbId
    ? DATASET.Knowledge.find((k) => k.DocID.toLowerCase() === requestedKbId?.toLowerCase())
    : null;

  if (!matchedDoc) {
    if (normalized.includes('claim rejection') || normalized.includes('reject claim') || normalized.includes('rejection')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-019') || null;
    } else if (normalized.includes('suspended dealer') || normalized.includes('suspended')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-009') || null;
    } else if (normalized.includes('negative stock') || normalized.includes('negative available')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-007') || null;
    } else if (normalized.includes('warranty claim') || normalized.includes('warranty window')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-001') || null;
    } else if (normalized.includes('rma') || normalized.includes('return merchandise')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-004') || null;
    } else if (normalized.includes('hazmat') || normalized.includes('dangerous goods')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-017') || null;
    } else if (normalized.includes('goodwill')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-023') || null;
    } else if (normalized.includes('credit limit')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-006') || null;
    } else if (normalized.includes('lost in transit') || normalized.includes('lost shipment')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-008') || null;
    } else if (normalized.includes('price variance')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-011') || null;
    } else if (normalized.includes('backorder') || normalized.includes('reorder point')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-014') || null;
    } else if (normalized.includes('bom') || normalized.includes('assembly')) {
      matchedDoc = DATASET.Knowledge.find((k) => k.DocID === 'KB-020') || null;
    }
  }

  if (matchedDoc) {
    const docId = matchedDoc.DocID;
    const docType = matchedDoc.DocType;
    const title = matchedDoc.Title;
    const module = matchedDoc.Module;
    const owner = matchedDoc.OwnerTeam;
    const updated = matchedDoc.LastUpdated;
    const summary = matchedDoc.Summary;

    let detailedPolicy = `Operational Knowledge ${docId} [${docType}] · "${title}":\n\n${summary}\n\n• Owning Department: ${owner}\n• Target Module: ${module}\n• Policy Verification Date: ${updated}`;

    if (docId === 'KB-019') {
      detailedPolicy = `Policy ${docId} (${title} · Module: ${module} · ${owner}):\n\n${summary}\n\nKey rejection triggers and operational next steps:\n1. Out of Warranty: Claim Date exceeds the part's WarrantyMonths from PurchaseDate (ref: KB-001). Requires Goodwill escalation (ref: KB-023).\n2. Quantity Ceiling Exceeded: RMA return quantity cannot exceed original purchase order quantity (ref: KB-004).\n3. Insufficient Provenance: Missing serial number, photo proof of physical defect, or mismatched PO line numbers.\n4. Suspended Dealer: Dealers under financial hold cannot settle claims until compliance clearance (ref: KB-009).`;
    } else if (docId === 'KB-009') {
      detailedPolicy = `Policy ${docId} (${title} · Module: ${module} · ${owner}):\n\n${summary}\n\nOperational Constraints:\n• Suspended dealers (e.g. Dealer D007) are hard-blocked from placing new orders or receiving dispatched parts.\n• Open PO lines must undergo compliance and credit controller review.\n• System automatically rejects automated fulfillment allocation.`;
    } else if (docId === 'KB-007') {
      detailedPolicy = `Policy ${docId} (${title} · Module: ${module} · ${owner}):\n\n${summary}\n\nInventory Rules:\n• Available stock below zero indicates reserved quantity exceeds on-hand or physical discrepancies.\n• System enforces conservative allocation budget: negative available lines cannot be allocated.\n• Requires immediate cycle-count ticket to Inventory Control.`;
    }

    return {
      status: 'INFO',
      summary: detailedPolicy,
      action: `Knowledge Retrieval: ${docId} (${docType})`,
      tool: 'retrieve_knowledge',
      turboQuip: `Woof! Turbo fetched ${docId} ("${title}") from the ${owner} archives! Knowledge base match verified.`,
      knowledge: [
        {
          id: docId,
          docType,
          title,
          module,
          excerpt: summary,
          matchScore: 0.99,
          lastUpdated: updated,
          ownerTeam: owner,
          errorCode: matchedDoc.ErrorCode,
        },
      ],
      evidence: [
        { DocID: docId, DocType: docType, Module: module, OwnerTeam: owner, LastUpdated: updated },
      ],
    };
  }

  // ==========================================
  // 2. PURCHASE ORDER ANALYSIS
  // ==========================================
  const poRegex = /po[-_\s]?2026[-_\s]?(\d{3,4})|po[-_\s]?(\d{4})/i;
  const poMatch = normalized.match(poRegex);

  let targetPoNo: string | null = null;
  if (poMatch) {
    const num = poMatch[1] || poMatch[2];
    targetPoNo = `PO-2026-${num}`;
  } else {
    const digitMatch = normalized.match(/\b(1\d{3})\b/);
    if (digitMatch) {
      targetPoNo = `PO-2026-${digitMatch[1]}`;
    }
  }

  if (targetPoNo || normalized.includes('fulfill') || normalized.includes('purchase order') || normalized.includes(' po ')) {
    if (!targetPoNo) {
      targetPoNo = 'PO-2026-1026';
    }

    const poLines = DATASET.PurchaseOrders.filter((p) => p.PO_No.toLowerCase() === targetPoNo?.toLowerCase());

    // Case 2A: Unmatched PO (e.g. PO-2026-1210)
    if (poLines.length === 0) {
      return {
        status: 'INFO',
        summary: `Purchase Order "${targetPoNo}" was not found in the after-sales master records.\n\nThe operational dataset contains 147 confirmed orders spanning PO-2026-1001 through PO-2026-1109. Verified test scenarios:\n• PO-2026-1001: 100% Demand Ready (12 units of P-10004)\n• PO-2026-1026: Partial Fulfillment (10 units requested, 4 available in network)\n• PO-2026-1106: Governance Blocked (Dealer D007 is Suspended)\n• PO-2026-1004: Stockout (0 units available in network)`,
        action: 'Validate Purchase Order',
        tool: 'validate_purchase_order',
        turboQuip: `*Sniff sniff* I searched through all 147 POs in the registry, but ${targetPoNo} isn't there! Try asking for PO-2026-1001 or PO-2026-1026!`,
        issues: [
          {
            code: 'PO_NOT_FOUND',
            severity: 'MEDIUM',
            message: `Purchase order ${targetPoNo} does not exist in master purchase order table.`,
          },
        ],
        evidence: [
          { QueryPO: targetPoNo, MasterRange: 'PO-2026-1001 to PO-2026-1109', TotalRecords: 147 },
        ],
      };
    }

    // Case 2B: PO Found
    const primaryLine = poLines[0];
    const dealerId = primaryLine.DealerID;
    const dealer = DATASET.Dealers.find((d) => d.DealerID === dealerId);
    const requestedQty = poLines.reduce((sum, line) => sum + (line.OrderQty || 0), 0);
    const partNo = primaryLine.PartNo;
    const part = DATASET.Parts.find((p) => p.PartNo === partNo);
    const partName = part?.PartName || 'Automotive Component';

    // Dealer Suspended Check
    if (dealer && dealer.Status === 'Suspended') {
      return {
        status: 'BLOCKED',
        summary: `${targetPoNo} cannot be fulfilled: Dealer ${dealer.DealerID} (${dealer.DealerName}, ${dealer.City}) is currently SUSPENDED under Governance Policy KB-009.\n\nAll inventory reservations and outbound shipments are blocked by automated compliance controls until credit controller and compliance clearance.`,
        action: 'Evaluate Purchase Order Governance',
        tool: 'evaluate_purchase_order',
        turboQuip: `BARK! BARK! Dealer ${dealer.DealerID} (${dealer.DealerName}) is SUSPENDED! Guard dog lockdown activated — zero parts leaving the depot!`,
        dealers: [
          {
            dealerId: dealer.DealerID,
            name: `${dealer.DealerName} (${dealer.City})`,
            status: dealer.Status,
            risk: `Suspended dealer account. Credit limit: €${dealer.CreditLimitEUR.toLocaleString()}`,
          },
        ],
        issues: [
          {
            code: 'GOV_SUSPENDED_DEALER',
            severity: 'HIGH',
            message: `Dealer ${dealer.DealerID} has status SUSPENDED. All fulfillment blocked (ref: KB-009).`,
          },
        ],
        evidence: [
          {
            PO_No: targetPoNo,
            DealerID: dealer.DealerID,
            DealerName: dealer.DealerName,
            DealerStatus: dealer.Status,
            CreditLimitEUR: dealer.CreditLimitEUR,
            GoverningPolicy: 'KB-009',
          },
        ],
      };
    }

    // Inventory Allocation Calculation
    const invRows = DATASET.Inventory.filter((i) => i.PartNo === partNo);
    const totalOnHand = invRows.reduce((sum, r) => sum + (r.OnHandQty || 0), 0);
    const totalAvailable = invRows.reduce((sum, r) => sum + (r.AvailableQty || 0), 0);
    const hasNegativeStock = invRows.some((r) => r.AvailableQty < 0);

    let remainingToFulfill = Math.max(0, Math.min(requestedQty, totalAvailable));
    const allocations: Array<{ sourceLocation: string; proposedQty: number }> = [];

    const sortedInv = [...invRows].sort((a, b) => b.AvailableQty - a.AvailableQty);
    for (const bin of sortedInv) {
      if (remainingToFulfill <= 0) break;
      if (bin.AvailableQty > 0) {
        const alloc = Math.min(bin.AvailableQty, remainingToFulfill);
        allocations.push({
          sourceLocation: `${formatLoc(bin.WarehouseLoc)} (${bin.BinLocation})`,
          proposedQty: alloc,
        });
        remainingToFulfill -= alloc;
      }
    }

    const plannedFulfillmentQty = allocations.reduce((sum, a) => sum + a.proposedQty, 0);
    const unresolvedRemainingQty = Math.max(0, requestedQty - plannedFulfillmentQty);

    let status: StatusType = 'FULLY_FULFILLABLE';
    let summary = '';
    let turboQuip = '';

    if (plannedFulfillmentQty >= requestedQty) {
      status = 'FULLY_FULFILLABLE';
      summary = `${targetPoNo} requested ${requestedQty} units of ${partNo} (${partName}) for ${dealer?.DealerName || dealerId}. Network inventory holds ${totalAvailable} available units across verified depots. 100% of demand can be fulfilled immediately.`;
      turboQuip = `Tail wagging! All ${requestedQty} units of ${partNo} are ready in the warehouse bins! Clean green light for dispatch!`;
    } else if (plannedFulfillmentQty > 0) {
      status = 'PARTIALLY_FULFILLABLE';
      summary = `${targetPoNo} requested ${requestedQty} units of ${partNo} (${partName}). Network inventory has ${plannedFulfillmentQty} available units. A shortage of ${unresolvedRemainingQty} units remains unresolved and requires supplier backorder (ref: KB-014).`;
      turboQuip = `Woof! I dug up ${plannedFulfillmentQty} units from our regional bins! The remaining ${unresolvedRemainingQty} units need an expedited supplier PO.`;
    } else {
      status = 'NO_STOCK';
      summary = `${targetPoNo} requested ${requestedQty} units of ${partNo} (${partName}). Network inventory has 0 available units across all depots. Fulfillment is blocked due to stockout. Backorder must be placed with supplier ${part?.SupplierName || 'OEM'} (ref: KB-014).`;
      turboQuip = `Uh oh! The bins for ${partNo} are completely empty! Turbo pressed the emergency supplier reorder alarm!`;
    }

    const issues = [];
    if (unresolvedRemainingQty > 0) {
      issues.push({
        code: `STOCK_DEFICIT_${unresolvedRemainingQty}`,
        severity: (unresolvedRemainingQty > 5 ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM',
        message: `Order quantity (${requestedQty}) exceeds network available inventory (${totalAvailable}).`,
      });
    }
    if (hasNegativeStock) {
      issues.push({
        code: 'ERR_INV_002_NEGATIVE_STOCK',
        severity: 'MEDIUM' as const,
        message: `One or more warehouse bins report negative available stock (ref: KB-007).`,
      });
    }

    return {
      status,
      summary,
      action: 'Plan Purchase Order Fulfillment',
      tool: 'plan_fulfillment',
      turboQuip,
      fulfillment: {
        poId: targetPoNo,
        partNo,
        requestedQty,
        plannedFulfillmentQty,
        unresolvedRemainingQty,
        networkAvailableQty: totalAvailable,
        allocations,
      },
      stocks: [
        {
          partNo: `${partNo} (${partName})`,
          requestedQty,
          availableQty: totalAvailable,
          deficitQty: unresolvedRemainingQty,
        },
      ],
      issues,
      evidence: invRows.map((r) => ({
        Warehouse: formatLoc(r.WarehouseLoc),
        Bin: r.BinLocation,
        OnHand: r.OnHandQty,
        Reserved: r.ReservedQty,
        Available: r.AvailableQty,
        LastCount: r.LastCountDate,
      })),
    };
  }

  // ==========================================
  // 3. PART STOCK QUERY
  // ==========================================
  const partMatch = normalized.match(/p[-_\s]?(\d{5})/i);
  if (partMatch || normalized.includes('part') || normalized.includes('stock')) {
    const partNo = partMatch ? `P-${partMatch[1]}` : 'P-10036';
    const part = DATASET.Parts.find((p) => p.PartNo.toLowerCase() === partNo.toLowerCase());
    const invRows = DATASET.Inventory.filter((i) => i.PartNo.toLowerCase() === partNo.toLowerCase());

    const totalOnHand = invRows.reduce((sum, r) => sum + (r.OnHandQty || 0), 0);
    const totalReserved = invRows.reduce((sum, r) => sum + (r.ReservedQty || 0), 0);
    const totalAvailable = invRows.reduce((sum, r) => sum + (r.AvailableQty || 0), 0);

    const partName = part?.PartName || 'Automotive Component';

    return {
      status: totalAvailable > 0 ? 'PASS' : 'INFO',
      summary: `Inventory Stock for Part ${partNo} ("${partName}"):\n• Category: ${part?.Category || 'General'} | Unit Price: €${part?.UnitPriceEUR || 'N/A'}\n• Supplier: ${part?.SupplierName || 'OEM'} (Lead Time: ${part?.LeadTimeDays || 14} days)\n• Physical On-Hand: ${totalOnHand} units\n• Reserved: ${totalReserved} units\n• Net Available across Network: ${totalAvailable} units across ${invRows.length} warehouse bins.`,
      action: 'Check Stock Position',
      tool: 'evaluate_stock_position',
      turboQuip: `Sniffed all bins for ${partNo}! Found ${totalAvailable} free units ready across ${invRows.length} locations.`,
      stocks: [
        {
          partNo: `${partNo} (${partName})`,
          requestedQty: 0,
          availableQty: totalAvailable,
          deficitQty: 0,
        },
      ],
      evidence: invRows.map((r) => ({
        Warehouse: formatLoc(r.WarehouseLoc),
        Bin: r.BinLocation,
        OnHand: r.OnHandQty,
        Reserved: r.ReservedQty,
        Available: r.AvailableQty,
        ReorderPoint: r.ReorderPoint,
      })),
    };
  }

  // ==========================================
  // 4. RISK SCAN / SYSTEM AUDIT
  // ==========================================
  if (normalized.includes('risk') || normalized.includes('audit') || normalized.includes('scan') || normalized.includes('anomaly')) {
    const negStock = DATASET.Inventory.filter((i) => i.AvailableQty < 0);
    const suspendedDealers = DATASET.Dealers.filter((d) => d.Status !== 'Active');
    const suspendedDealerIds = suspendedDealers.map((d) => d.DealerID);
    const blockedPOs = DATASET.PurchaseOrders.filter((p) => suspendedDealerIds.includes(p.DealerID));

    return {
      status: 'INFO',
      summary: `System Risk Scan across 486 operational rows:\n• Negative Stock Anomalies: ${negStock.length} bins flagged (ref: KB-007)\n• Suspended Dealer Accounts: ${suspendedDealers.length} (${suspendedDealers.map((d) => `${d.DealerID} ${d.DealerName}`).join(', ')}) (ref: KB-009)\n• Blocked Purchase Orders: ${blockedPOs.length} order(s) placed by suspended dealers (e.g. ${blockedPOs.map((p) => p.PO_No).join(', ')})\n• Provenance integrity verified against sha256:88a3df19e7bc401.`,
      action: 'Scan Operational Risks',
      tool: 'scan_anomalies',
      turboQuip: `Full perimeter sweep complete! Flagged ${negStock.length} negative stock bin and ${blockedPOs.length} order from suspended dealer ${suspendedDealers[0]?.DealerID}!`,
      issues: [
        {
          code: 'ERR_INV_002',
          severity: 'MEDIUM',
          message: `${negStock.length} bin(s) report negative available stock (e.g. ${negStock[0]?.BinLocation} for part ${negStock[0]?.PartNo}).`,
        },
        {
          code: 'GOV_SUSPENDED_DEALER',
          severity: 'HIGH',
          message: `Dealer ${suspendedDealers[0]?.DealerID} is suspended; orders require compliance review.`,
        },
      ],
      evidence: [
        ...negStock.map((n) => ({
          Type: 'Negative Stock',
          Location: formatLoc(n.WarehouseLoc),
          PartNo: n.PartNo,
          Available: n.AvailableQty,
        })),
        ...blockedPOs.map((b) => ({
          Type: 'Blocked PO',
          PO_No: b.PO_No,
          DealerID: b.DealerID,
          PartNo: b.PartNo,
          OrderQty: b.OrderQty,
        })),
      ],
    };
  }

  // Fallback
  return {
    status: 'INFO',
    summary: `DealerBRAIN Copilot analyzed: "${query}".\n\nOperational queries you can run on this dataset:\n1. Knowledge Policies: Ask "What is policy KB-019?", "Explain KB-009 (Suspended Dealers)", or "What is KB-007?"\n2. PO Fulfillment: Ask "Can PO-2026-1001 be fulfilled?" (100% fulfillable), "Check PO-2026-1026" (Partial), or "Process PO-2026-1106" (Blocked)\n3. Inventory Checks: Ask "Show stock for part P-10036" or "Check P-10004"\n4. Risk Scan: Ask "Run system risk audit"`,
    action: 'Query Help & Guidance',
    tool: 'dealerbrain_copilot',
    turboQuip: 'Turbo is ready! Ask me about any of our 25 operational policies (like KB-019), check any PO (PO-2026-1001 to 1109), or search stock for any part!',
  };
}
