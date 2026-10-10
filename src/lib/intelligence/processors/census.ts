import { createServerClient } from '@/lib/db/client'
import { hashPayload } from '../hash'
import type { SourceRecord } from '../types'

type IntelligenceDb = ReturnType<typeof createServerClient>

const AGE_65_PLUS_FIELDS = [
  'B01001_020E', 'B01001_021E', 'B01001_022E', 'B01001_023E', 'B01001_024E', 'B01001_025E',
  'B01001_044E', 'B01001_045E', 'B01001_046E', 'B01001_047E', 'B01001_048E', 'B01001_049E',
] as const

function estimate(payload: Record<string, unknown>, key: string): number | null {
  const raw = payload[key]
  if (raw === null || raw === undefined || raw === '') return null
  const value = Number(raw)
  if (!Number.isFinite(value) || value < 0) return null
  return value
}

function rounded(value: number, digits = 2) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export type CensusProcessingResult = {
  factsUpserted: number
  signalsUpserted: number
  skipped: number
}

export async function processCensusCountyDemographics(
  db: IntelligenceDb,
  sourceId: string,
  records: SourceRecord[]
): Promise<CensusProcessingResult> {
  let factsUpserted = 0
  let signalsUpserted = 0
  let skipped = 0

  for (const record of records) {
    if (record.recordType !== 'county_demographics') continue

    const payload = record.payload
    const totalPopulation = estimate(payload, 'B01001_001E')
    const ageValues = AGE_65_PLUS_FIELDS.map((field) => estimate(payload, field))
    const stateFips = String(payload.state || '')
    const countyFips = String(payload.county || '')
    const countyName = String(payload.NAME || '').trim()

    if (
      totalPopulation === null || totalPopulation <= 0 ||
      ageValues.some((value) => value === null) ||
      !/^\d{2}$/.test(stateFips) || !/^\d{3}$/.test(countyFips) || !countyName
    ) {
      skipped += 1
      continue
    }

    const age65Plus = ageValues.reduce<number>((sum, value) => sum + (value ?? 0), 0)
    const age65PlusPercent = rounded((age65Plus / totalPopulation) * 100, 2)
    const dataYear = String(record.metadata?.year || record.effectiveAt?.slice(0, 4) || '')
    const canonicalKey = `geo:us:state:${stateFips}:county:${countyFips}`

    const { data: entity, error: entityError } = await db
      .from('intelligence_entities')
      .upsert({
        entity_type: 'place',
        canonical_name: countyName,
        canonical_key: canonicalKey,
        attributes: {
          country: 'US',
          state_fips: stateFips,
          county_fips: countyFips,
          geography_level: 'county',
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'canonical_key' })
      .select('id')
      .single()
    if (entityError || !entity) throw new Error(entityError?.message || `Could not upsert entity ${canonicalKey}`)

    const payloadHash = hashPayload(payload)
    const { data: raw, error: rawError } = await db
      .from('raw_records')
      .select('id')
      .eq('source_id', sourceId)
      .eq('external_id', record.externalId)
      .eq('payload_hash', payloadHash)
      .single()
    if (rawError || !raw) throw new Error(rawError?.message || `Raw record not found for ${record.externalId}`)

    const factKey = `census:age65plus-share:${stateFips}${countyFips}`
    const now = new Date().toISOString()
    const { data: fact, error: factError } = await db
      .from('facts')
      .upsert({
        fact_key: factKey,
        entity_id: entity.id,
        predicate: 'population_age_65_plus_share',
        value: {
          estimate_age_65_plus: age65Plus,
          estimate_total_population: totalPopulation,
          percent: age65PlusPercent,
          unit: 'percent',
          data_year: dataYear,
        },
        confidence: 0.8,
        valid_from: record.effectiveAt || null,
        first_seen_at: now,
        last_seen_at: now,
        status: 'active',
        metadata: {
          source: 'U.S. Census Bureau American Community Survey',
          dataset: record.metadata?.dataset,
          estimate_type: 'ACS 5-year estimate',
          variables: ['B01001_001E', ...AGE_65_PLUS_FIELDS],
          note: 'Confidence is conservative because margins of error are not ingested in this first signal version.',
        },
      }, { onConflict: 'fact_key' })
      .select('id')
      .single()
    if (factError || !fact) throw new Error(factError?.message || `Could not upsert fact ${factKey}`)
    factsUpserted += 1

    const { error: evidenceError } = await db.from('fact_evidence').upsert({
      fact_id: fact.id,
      raw_record_id: raw.id,
      evidence_path: '$',
    }, { onConflict: 'fact_id,raw_record_id' })
    if (evidenceError) throw evidenceError

    const signalKey = `market-demographic:age65plus:${stateFips}${countyFips}`
    const intensityScore = rounded(Math.min(100, age65PlusPercent * 4), 2)
    const { error: signalError } = await db.from('intelligence_signals').upsert({
      signal_key: signalKey,
      entity_id: entity.id,
      signal_type: 'market_demographic',
      title: `${countyName}: ${age65PlusPercent.toFixed(1)}% age 65+`,
      summary: `ACS ${dataYear} 5-year estimates indicate approximately ${Math.round(age65Plus).toLocaleString('en-US')} of ${Math.round(totalPopulation).toLocaleString('en-US')} residents are age 65 or older (${age65PlusPercent.toFixed(1)}%).`,
      score: intensityScore,
      confidence: 0.8,
      geography: {
        country: 'US',
        state_fips: stateFips,
        county_fips: countyFips,
        name: countyName,
      },
      audience: {
        level: 'aggregate_market',
        use: 'market_planning',
        individual_eligibility: false,
      },
      evidence: [{
        raw_record_id: raw.id,
        source: 'U.S. Census Bureau American Community Survey',
        source_url: record.sourceUrl,
        external_id: record.externalId,
        data_year: dataYear,
        variables: ['B01001_001E', ...AGE_65_PLUS_FIELDS],
      }],
      status: 'active',
      detected_at: now,
      metadata: {
        metric: 'age_65_plus_population_share',
        metric_value: age65PlusPercent,
        total_population_estimate: totalPopulation,
        age_65_plus_estimate: age65Plus,
        score_basis: 'Demographic intensity only: min(100, age-65-plus share percent × 4). This is not lead quality, eligibility, or a prediction about any person.',
        data_type: 'estimate',
        data_year: dataYear,
      },
    }, { onConflict: 'signal_key' })
    if (signalError) throw signalError
    signalsUpserted += 1
  }

  return { factsUpserted, signalsUpserted, skipped }
}
