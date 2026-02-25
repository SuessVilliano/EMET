const BASE_URL = process.env.WORLDMONITOR_API_URL || 'https://worldmonitor.app'

// ---------------------------------------------------------------------------
// Shared types (matching World Monitor proto definitions)
// ---------------------------------------------------------------------------

export type SeverityLevel = 0 | 1 | 2 | 3 // UNSPECIFIED | LOW | MEDIUM | HIGH
export type CriticalityLevel = 0 | 1 | 2 | 3 | 4 // UNSPECIFIED | LOW | MEDIUM | HIGH | CRITICAL
export type ThreatLevel = 0 | 1 | 2 | 3 | 4 // UNSPECIFIED | LOW | MEDIUM | HIGH | CRITICAL
export type TrendDirection = 0 | 1 | 2 | 3 // UNSPECIFIED | RISING | STABLE | FALLING

interface GeoCoordinates {
  latitude: number
  longitude: number
}

interface PaginationRequest {
  page_size: number
  cursor?: string
}

interface PaginationResponse {
  next_cursor: string
  total_count: number
}

interface TimeRange {
  start: number // Unix epoch ms
  end: number
}

// ---------------------------------------------------------------------------
// Intelligence
// ---------------------------------------------------------------------------

export interface EventClassification {
  category: string
  subcategory: string
  severity: SeverityLevel
  confidence: number
  analysis: string
  entities: string[]
}

export interface CiiScore {
  region: string
  static_baseline: number
  dynamic_score: number
  combined_score: number
  trend: TrendDirection
  components: {
    news_activity: number
    cii_contribution: number
    geo_convergence: number
    military_activity: number
  }
  computed_at: number
}

export interface StrategicRisk {
  region: string
  level: SeverityLevel
  score: number
  factors: string[]
  trend: TrendDirection
}

// ---------------------------------------------------------------------------
// Unrest
// ---------------------------------------------------------------------------

export interface UnrestEvent {
  id: string
  title: string
  summary: string
  event_type: number // 0-5: UNSPECIFIED | PROTEST | RIOT | STRIKE | DEMONSTRATION | CIVIL_UNREST
  city: string
  country: string
  region: string
  location: GeoCoordinates
  occurred_at: number
  severity: SeverityLevel
  fatalities: number
  sources: string[]
  source_type: number
  tags: string[]
  actors: string[]
  confidence: number
}

// ---------------------------------------------------------------------------
// Conflict
// ---------------------------------------------------------------------------

export interface AcledConflictEvent {
  id: string
  event_type: string
  country: string
  location: GeoCoordinates
  occurred_at: number
  fatalities: number
  actors: string[]
  source: string
  admin1: string
}

// ---------------------------------------------------------------------------
// Cyber
// ---------------------------------------------------------------------------

export interface CyberThreat {
  id: string
  type: number
  source: number
  indicator: string
  indicator_type: number
  location: GeoCoordinates
  country: string
  severity: CriticalityLevel
  malware_family: string
  tags: string[]
  first_seen_at: number
  last_seen_at: number
}

// ---------------------------------------------------------------------------
// Economic / Energy
// ---------------------------------------------------------------------------

export interface EnergyPrice {
  commodity: string
  name: string
  price: number
  unit: string
  change: number
  price_at: number
}

// ---------------------------------------------------------------------------
// Infrastructure
// ---------------------------------------------------------------------------

export interface InternetOutage {
  id: string
  title: string
  link: string
  description: string
  detected_at: number
  country: string
  region: string
  location: GeoCoordinates
  severity: number // 0-3: UNSPECIFIED | PARTIAL | MAJOR | TOTAL
  categories: string[]
  cause: string
  outage_type: string
  ended_at: number
}

// ---------------------------------------------------------------------------
// Climate
// ---------------------------------------------------------------------------

export interface ClimateAnomaly {
  id: string
  type: string
  location: GeoCoordinates
  country: string
  severity: SeverityLevel
  value: number
  baseline: number
  deviation: number
  detected_at: number
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface SummarizeResponse {
  summary: string
  model: string
  provider: string
  cached: boolean
  tokens: number
  error?: string
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------

async function post<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  const apiKey = process.env.WORLDMONITOR_API_KEY
  if (apiKey) {
    headers['X-WorldMonitor-Key'] = apiKey
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    throw new Error(`WorldMonitor ${path} responded ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Exported API methods
// ---------------------------------------------------------------------------

export async function classifyEvent(title: string, description?: string, source?: string) {
  return post<{ classification: EventClassification }>(
    '/api/intelligence/v1/classify-event',
    { title, description: description ?? '', source: source ?? '' }
  )
}

export async function getRiskScores(region?: string) {
  return post<{ cii_scores: CiiScore[]; strategic_risks: StrategicRisk[] }>(
    '/api/intelligence/v1/get-risk-scores',
    { region: region ?? '' }
  )
}

export async function listUnrestEvents(opts?: {
  time_range?: TimeRange
  pagination?: PaginationRequest
  country?: string
  min_severity?: SeverityLevel
}) {
  return post<{ events: UnrestEvent[]; pagination: PaginationResponse }>(
    '/api/unrest/v1/list-unrest-events',
    {
      time_range: opts?.time_range,
      pagination: opts?.pagination ?? { page_size: 50 },
      country: opts?.country ?? '',
      min_severity: opts?.min_severity ?? 0,
    }
  )
}

export async function listAcledEvents(opts?: {
  time_range?: TimeRange
  pagination?: PaginationRequest
  country?: string
}) {
  return post<{ events: AcledConflictEvent[]; pagination: PaginationResponse }>(
    '/api/conflict/v1/list-acled-events',
    {
      time_range: opts?.time_range,
      pagination: opts?.pagination ?? { page_size: 50 },
      country: opts?.country ?? '',
    }
  )
}

export async function listCyberThreats(opts?: {
  time_range?: TimeRange
  pagination?: PaginationRequest
  min_severity?: CriticalityLevel
}) {
  return post<{ threats: CyberThreat[]; pagination: PaginationResponse }>(
    '/api/cyber/v1/list-cyber-threats',
    {
      time_range: opts?.time_range,
      pagination: opts?.pagination ?? { page_size: 50 },
      min_severity: opts?.min_severity ?? 0,
    }
  )
}

export async function getEnergyPrices(commodities?: string[]) {
  return post<{ prices: EnergyPrice[] }>(
    '/api/economic/v1/get-energy-prices',
    { commodities: commodities ?? [] }
  )
}

export async function listInternetOutages(opts?: {
  time_range?: TimeRange
  pagination?: PaginationRequest
  country?: string
}) {
  return post<{ outages: InternetOutage[]; pagination: PaginationResponse }>(
    '/api/infrastructure/v1/list-internet-outages',
    {
      time_range: opts?.time_range,
      pagination: opts?.pagination ?? { page_size: 50 },
      country: opts?.country ?? '',
    }
  )
}

export async function listClimateAnomalies(opts?: {
  time_range?: TimeRange
  pagination?: PaginationRequest
}) {
  return post<{ anomalies: ClimateAnomaly[]; pagination: PaginationResponse }>(
    '/api/climate/v1/list-climate-anomalies',
    {
      time_range: opts?.time_range,
      pagination: opts?.pagination ?? { page_size: 50 },
    }
  )
}

export async function summarizeArticle(headlines: string[], mode?: string) {
  return post<SummarizeResponse>(
    '/api/news/v1/summarize-article',
    {
      provider: 'groq',
      headlines: headlines.slice(0, 8),
      mode: mode ?? 'brief',
      variant: 'full',
      lang: 'en',
    }
  )
}
