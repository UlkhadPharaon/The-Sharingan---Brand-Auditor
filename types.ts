export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AuditScores {
  aesthetics: number; // 0-100
  storytelling: number;
  authority: number;
  ux: number;
  uniqueness: number;
}

export interface AuditResponse {
  markdownReport: string;
  scores: AuditScores;
  visionPrompts: string[];
  versusReport?: string; // Optional comparison markdown
  groundingChunks?: GroundingChunk[];
}

export enum ScanMode {
  STANDARD = 'SHARINGAN STANDARD',
  MANGEKYOU = 'MANGEKYOU SHARINGAN'
}

export interface AuditState {
  status: 'idle' | 'scanning' | 'complete' | 'error';
  data: AuditResponse | null;
  error?: string;
}

export interface ScanRequest {
  company: string;
  competitor?: string;
  mode: ScanMode;
  imageBase64?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  company: string;
  mode: ScanMode;
  data: AuditResponse;
}