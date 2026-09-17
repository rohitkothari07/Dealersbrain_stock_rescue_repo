export type StatusType = 'FULLY_FULFILLABLE' | 'PARTIALLY_FULFILLABLE' | 'NO_STOCK' | 'BLOCKED' | 'PASS' | 'INFO';

export interface Allocation {
  sourceLocation: string;
  proposedQty: number;
}

export interface FulfillmentPlan {
  poId: string;
  partNo: string;
  requestedQty: number;
  plannedFulfillmentQty: number;
  unresolvedRemainingQty: number;
  networkAvailableQty: number;
  allocations: Allocation[];
}

export interface StockPosition {
  partNo: string;
  requestedQty: number;
  availableQty: number;
  deficitQty: number;
}

export interface IssueCode {
  code: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
}

export interface KnowledgeItem {
  id: string;
  docType?: string;
  title: string;
  module?: string;
  excerpt: string;
  matchScore: number;
  lastUpdated?: string;
  ownerTeam?: string;
  errorCode?: string;
}

export interface DecisionResult {
  status: StatusType;
  summary: string;
  fulfillment?: FulfillmentPlan;
  stocks?: StockPosition[];
  issues?: IssueCode[];
  dealers?: Array<{ dealerId: string; name: string; status: string; risk: string }>;
  evidence?: Array<Record<string, string | number>>;
  knowledge?: KnowledgeItem[];
  turboQuip: string;
  action: string;
  tool: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  result?: DecisionResult;
  simulatedApproved?: boolean;
}

export type PetMood = 'SNIFFING' | 'ZOOMIES' | 'GUARDING' | 'NAPPING' | 'HAPPY';
