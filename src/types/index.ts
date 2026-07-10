export type Role = 'manager' | 'pm' | 'analyst';

export interface User {
  id: string;
  username: string;
  role: Role;
  displayName: string;
  roleLabel: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type TimeRange = 'month' | 'quarter' | 'year';

export interface KpiCardData {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'flat';
  sparklineData: number[];
}

export interface TrendSeries {
  name: string;
  data: TrendPoint[];
  color: string;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface BreakdownItem {
  name: string;
  value: number;
  color?: string;
  children?: BreakdownItem[];
}

export type ChartType = 'line' | 'bar' | 'pie' | 'funnel' | 'scatter' | 'horizontal-bar';

export interface ChartData {
  labels: string[];
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface TableData {
  columns: { key: string; title: string }[];
  rows: Record<string, string | number>[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  intent?: string;
  sql?: string;
  chartData?: ChartData;
  chartType?: ChartType;
  tableData?: TableData;
  strategy?: string;
  isError?: boolean;
  isClarification?: boolean;
  clarificationOptions?: ClarificationOption[];
  attribution?: AttributionResult;
  feedback?: 'positive' | 'negative';
}

export type ReportStatus = 'draft' | 'published';

export interface Report {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  author: string;
  sections: ReportSection[];
}

export interface ReportSection {
  type: 'text' | 'chart' | 'table' | 'strategy';
  title: string;
  content: string;
  chartData?: ChartData;
  chartType?: ChartType;
  tableData?: TableData;
}

export interface Intent {
  category: string;
  confidence: number;
  chartType: ChartType;
}

export interface ExtractedEntities {
  time?: string;
  metric?: string;
  dimension?: string;
  filter?: string;
  aggregation?: string;
  topN?: number;
  compareTime?: string;
}

export interface QueryPattern {
  id: string;
  patterns: RegExp[];
  intent: Intent;
  extractEntities: (text: string) => ExtractedEntities;
  sqlTemplate: string;
  dataFn: string;
}

export interface DrillPathStep {
  dimension: string;
  value: string;
  label: string;
}

export interface Dimension {
  id: string;
  label: string;
  values: DimensionValue[];
}

export interface DimensionValue {
  id: string;
  label: string;
  children?: DimensionValue[];
}

// === New types for 4-stage ChatBI pipeline ===

export interface KnowledgeEntry {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  definition: string;
  relatedMetrics: string[];
  relatedDimensions: string[];
  relatedTables: string[];
  defaultChart: ChartType;
  unit: string;
}

export interface ModelTable {
  id: string;
  name: string;
  description: string;
  fields: ModelField[];
}

export interface ModelField {
  name: string;
  type: string;
  description: string;
  isDimension: boolean;
  isMetric: boolean;
}

export interface ClarificationOption {
  id: string;
  label: string;
  description: string;
  type: 'metric' | 'dimension' | 'time_range' | 'filter';
  value: string;
}

export interface AttributionResult {
  summary: string;
  factors: AttributionFactor[];
  suggestions: string[];
}

export interface AttributionFactor {
  description: string;
  contribution: number;
  details: string[];
}

export type FeedbackType = 'knowledge_missing' | 'wrong_calculation' | 'content_incomplete' | 'data_fabrication' | 'other';

export interface FeedbackData {
  messageId: string;
  query: string;
  type: 'positive' | 'negative';
  negativeType?: FeedbackType;
  comment?: string;
  timestamp: number;
}

export type QueryPhase = 'idle' | 'followup_detection' | 'intent_classification' | 'knowledge_retrieval' | 'clarification' | 'sql_generation' | 'attribution' | 'done';

export interface EnrichedQuery {
  original: string;
  mergedQuery?: string;
  isFollowUp: boolean;
  intent: 'chat' | 'query' | 'unknown';
  matchedMetrics: KnowledgeEntry[];
  matchedTables: ModelTable[];
  completeness: number;
  needsClarification: boolean;
  clarificationOptions: ClarificationOption[];
}

