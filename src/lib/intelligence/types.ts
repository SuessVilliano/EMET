export type SourceRecord = {
  externalId: string
  recordType: string
  sourceUrl?: string
  effectiveAt?: string
  publishedAt?: string
  payload: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export type ConnectorContext = {
  since?: string
  cursor?: Record<string, unknown>
  limit?: number
}

export interface IntelligenceConnector {
  slug: string
  sourceSlug: string
  fetch(context?: ConnectorContext): Promise<SourceRecord[]>
}

export type IntelligenceSignal = {
  id: string
  signal_type: string
  title: string
  summary: string | null
  score: number
  confidence: number
  geography: Record<string, unknown> | null
  audience: Record<string, unknown>
  evidence: Array<Record<string, unknown>>
  detected_at: string
  expires_at: string | null
  metadata: Record<string, unknown>
}
