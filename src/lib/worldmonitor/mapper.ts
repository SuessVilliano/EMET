import type {
  UnrestEvent,
  AcledConflictEvent,
  CyberThreat,
  EnergyPrice,
  InternetOutage,
  ClimateAnomaly,
  SeverityLevel,
  CriticalityLevel,
} from './client'

// Row shape matching the EMET news_alerts table
export interface NewsAlertRow {
  source: string
  title: string
  summary: string
  threat_level: 'critical' | 'high' | 'medium' | 'low'
  category: 'water' | 'energy' | 'food' | 'housing' | 'finance' | 'legal'
  url: string | null
}

// ---------------------------------------------------------------------------
// Severity mapping helpers
// ---------------------------------------------------------------------------

function severityToThreat(s: SeverityLevel): NewsAlertRow['threat_level'] {
  // 0 = UNSPECIFIED, 1 = LOW, 2 = MEDIUM, 3 = HIGH
  if (s >= 3) return 'high'
  if (s === 2) return 'medium'
  return 'low'
}

function criticalityToThreat(c: CriticalityLevel): NewsAlertRow['threat_level'] {
  // 0 = UNSPECIFIED, 1 = LOW, 2 = MEDIUM, 3 = HIGH, 4 = CRITICAL
  if (c >= 4) return 'critical'
  if (c === 3) return 'high'
  if (c === 2) return 'medium'
  return 'low'
}

function outageSeverityToThreat(s: number): NewsAlertRow['threat_level'] {
  // 0 = UNSPECIFIED, 1 = PARTIAL, 2 = MAJOR, 3 = TOTAL
  if (s >= 3) return 'critical'
  if (s === 2) return 'high'
  if (s === 1) return 'medium'
  return 'low'
}

// ---------------------------------------------------------------------------
// Unrest -> news_alerts
// ---------------------------------------------------------------------------

const UNREST_TYPE_LABELS: Record<number, string> = {
  1: 'Protest',
  2: 'Riot',
  3: 'Strike',
  4: 'Demonstration',
  5: 'Civil unrest',
}

function unrestCategory(event: UnrestEvent): NewsAlertRow['category'] {
  const text = `${event.title} ${event.summary} ${event.tags.join(' ')}`.toLowerCase()
  if (/water|drought|flood|dam\b/.test(text)) return 'water'
  if (/energy|oil|gas|power|electric/.test(text)) return 'energy'
  if (/food|grain|famine|hunger|agri/.test(text)) return 'food'
  if (/hous|evict|rent|shelter|displace/.test(text)) return 'housing'
  if (/law|court|legal|rights|sanction|polic/.test(text)) return 'legal'
  return 'finance' // economic disruption default for unrest
}

export function mapUnrestEvents(events: UnrestEvent[]): NewsAlertRow[] {
  return events.map((e) => {
    const typeLabel = UNREST_TYPE_LABELS[e.event_type] ?? 'Unrest'
    const location = [e.city, e.region, e.country].filter(Boolean).join(', ')
    return {
      source: `WorldMonitor / ${e.sources?.[0] ?? 'ACLED/GDELT'}`,
      title: e.title || `${typeLabel} in ${location}`,
      summary: e.summary || `${typeLabel} event reported in ${location}. Fatalities: ${e.fatalities ?? 0}.`,
      threat_level: e.fatalities > 0 ? escalate(severityToThreat(e.severity)) : severityToThreat(e.severity),
      category: unrestCategory(e),
      url: null,
    }
  })
}

// ---------------------------------------------------------------------------
// Conflict -> news_alerts
// ---------------------------------------------------------------------------

export function mapConflictEvents(events: AcledConflictEvent[]): NewsAlertRow[] {
  return events.map((e) => {
    const location = [e.admin1, e.country].filter(Boolean).join(', ')
    const threat: NewsAlertRow['threat_level'] =
      e.fatalities >= 50 ? 'critical' : e.fatalities >= 10 ? 'high' : e.fatalities > 0 ? 'medium' : 'low'
    return {
      source: `WorldMonitor / ACLED`,
      title: `${e.event_type} in ${location}`,
      summary: `${e.event_type} involving ${e.actors.join(' vs ')}. Fatalities: ${e.fatalities}. Source: ${e.source}.`,
      threat_level: threat,
      category: 'legal', // armed conflict -> legal/governance domain
      url: null,
    }
  })
}

// ---------------------------------------------------------------------------
// Cyber -> news_alerts
// ---------------------------------------------------------------------------

const CYBER_TYPE_LABELS: Record<number, string> = {
  1: 'C2 Server',
  2: 'Malware Host',
  3: 'Phishing',
  4: 'Malicious URL',
}

export function mapCyberThreats(threats: CyberThreat[]): NewsAlertRow[] {
  return threats.map((t) => {
    const typeLabel = CYBER_TYPE_LABELS[t.type] ?? 'Cyber threat'
    const family = t.malware_family ? ` (${t.malware_family})` : ''
    return {
      source: 'WorldMonitor / Cyber Intel',
      title: `${typeLabel} detected${family}`,
      summary: `${typeLabel} indicator: ${t.indicator}. Country: ${t.country || 'unknown'}. Tags: ${t.tags.join(', ') || 'none'}.`,
      threat_level: criticalityToThreat(t.severity),
      category: 'legal', // cybersecurity -> legal domain
      url: null,
    }
  })
}

// ---------------------------------------------------------------------------
// Energy prices -> news_alerts (only on significant moves)
// ---------------------------------------------------------------------------

export function mapEnergyPrices(prices: EnergyPrice[]): NewsAlertRow[] {
  return prices
    .filter((p) => Math.abs(p.change) >= 3) // only alert on 3%+ moves
    .map((p) => {
      const direction = p.change > 0 ? 'surged' : 'dropped'
      const threat: NewsAlertRow['threat_level'] =
        Math.abs(p.change) >= 10 ? 'critical' : Math.abs(p.change) >= 7 ? 'high' : Math.abs(p.change) >= 5 ? 'medium' : 'low'
      return {
        source: 'WorldMonitor / EIA',
        title: `${p.name} ${direction} ${Math.abs(p.change).toFixed(1)}%`,
        summary: `${p.name} is now at ${p.price.toFixed(2)} ${p.unit}. Change: ${p.change > 0 ? '+' : ''}${p.change.toFixed(1)}%.`,
        threat_level: threat,
        category: 'energy' as const,
        url: null,
      }
    })
}

// ---------------------------------------------------------------------------
// Internet outages -> news_alerts
// ---------------------------------------------------------------------------

export function mapInternetOutages(outages: InternetOutage[]): NewsAlertRow[] {
  return outages
    .filter((o) => !o.ended_at) // only ongoing outages
    .map((o) => ({
      source: 'WorldMonitor / Cloudflare Radar',
      title: o.title || `Internet outage in ${o.country}`,
      summary: o.description || `${o.outage_type ?? 'Internet'} outage detected in ${[o.region, o.country].filter(Boolean).join(', ')}. Cause: ${o.cause || 'under investigation'}.`,
      threat_level: outageSeverityToThreat(o.severity),
      category: 'finance' as const, // infrastructure disruption -> economic impact
      url: o.link || null,
    }))
}

// ---------------------------------------------------------------------------
// Climate anomalies -> news_alerts
// ---------------------------------------------------------------------------

function climateCategory(anomaly: ClimateAnomaly): NewsAlertRow['category'] {
  const t = (anomaly.type ?? '').toLowerCase()
  if (/precip|rain|flood|drought/.test(t)) return 'water'
  if (/temp|heat|cold/.test(t)) return 'food' // temperature extremes -> agriculture
  return 'water' // default climate -> water
}

export function mapClimateAnomalies(anomalies: ClimateAnomaly[]): NewsAlertRow[] {
  return anomalies.map((a) => ({
    source: 'WorldMonitor / Climate',
    title: `Climate anomaly: ${a.type} in ${a.country || 'unknown region'}`,
    summary: `${a.type} anomaly detected. Value: ${a.value}, baseline: ${a.baseline}, deviation: ${a.deviation?.toFixed(1) ?? 'N/A'}.`,
    threat_level: severityToThreat(a.severity),
    category: climateCategory(a),
    url: null,
  }))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escalate(level: NewsAlertRow['threat_level']): NewsAlertRow['threat_level'] {
  if (level === 'low') return 'medium'
  if (level === 'medium') return 'high'
  if (level === 'high') return 'critical'
  return level
}

// ---------------------------------------------------------------------------
// Deduplication key — used to avoid inserting the same alert twice
// ---------------------------------------------------------------------------

export function deduplicationKey(row: NewsAlertRow): string {
  return `${row.source}::${row.title}`.toLowerCase().replace(/\s+/g, ' ').trim()
}
