import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import * as wm from '@/lib/worldmonitor/client'
import {
  mapUnrestEvents,
  mapConflictEvents,
  mapCyberThreats,
  mapEnergyPrices,
  mapInternetOutages,
  mapClimateAnomalies,
  deduplicationKey,
  type NewsAlertRow,
} from '@/lib/worldmonitor/mapper'

// Vercel cron or manual trigger — pulls from World Monitor APIs and upserts
// into the Supabase news_alerts table.
//
// Trigger options:
//   1. Vercel Cron: add to vercel.json  { "crons": [{ "path": "/api/news/ingest", "schedule": "*/10 * * * *" }] }
//   2. Manual: POST /api/news/ingest  (requires CRON_SECRET header in production)

export const maxDuration = 30 // seconds

export async function POST(req: Request) {
  // Simple auth — prevent public abuse in production
  if (process.env.NODE_ENV === 'production') {
    const secret = req.headers.get('authorization')?.replace('Bearer ', '')
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createServerClient()
  const now = Date.now()
  const sixHoursAgo = now - 6 * 60 * 60 * 1000
  const timeRange = { start: sixHoursAgo, end: now }

  // Fetch all sources in parallel — each one is independent and can fail
  // without blocking the others
  const results = await Promise.allSettled([
    wm.listUnrestEvents({ time_range: timeRange, pagination: { page_size: 30 } }),
    wm.listAcledEvents({ time_range: timeRange, pagination: { page_size: 30 } }),
    wm.listCyberThreats({ time_range: timeRange, pagination: { page_size: 20 }, min_severity: 2 }),
    wm.getEnergyPrices(),
    wm.listInternetOutages({ time_range: timeRange, pagination: { page_size: 20 } }),
    wm.listClimateAnomalies({ time_range: timeRange, pagination: { page_size: 20 } }),
  ])

  // Map each successful response to EMET rows
  const rows: NewsAlertRow[] = []

  if (results[0].status === 'fulfilled') {
    rows.push(...mapUnrestEvents(results[0].value.events ?? []))
  }
  if (results[1].status === 'fulfilled') {
    rows.push(...mapConflictEvents(results[1].value.events ?? []))
  }
  if (results[2].status === 'fulfilled') {
    rows.push(...mapCyberThreats(results[2].value.threats ?? []))
  }
  if (results[3].status === 'fulfilled') {
    rows.push(...mapEnergyPrices(results[3].value.prices ?? []))
  }
  if (results[4].status === 'fulfilled') {
    rows.push(...mapInternetOutages(results[4].value.outages ?? []))
  }
  if (results[5].status === 'fulfilled') {
    rows.push(...mapClimateAnomalies(results[5].value.anomalies ?? []))
  }

  if (rows.length === 0) {
    return NextResponse.json({ ingested: 0, message: 'No new alerts from World Monitor' })
  }

  // Deduplicate within this batch
  const seen = new Set<string>()
  const unique = rows.filter((r) => {
    const key = deduplicationKey(r)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Check existing titles from the last 24 hours to avoid re-inserting
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('news_alerts')
    .select('title, source')
    .gte('created_at', oneDayAgo)

  const existingKeys = new Set(
    (existing ?? []).map((row: { title: string; source: string }) =>
      `${row.source}::${row.title}`.toLowerCase().replace(/\s+/g, ' ').trim()
    )
  )

  const toInsert = unique.filter((r) => !existingKeys.has(deduplicationKey(r)))

  if (toInsert.length === 0) {
    return NextResponse.json({ ingested: 0, message: 'All alerts already exist' })
  }

  const { error, count } = await supabase
    .from('news_alerts')
    .insert(toInsert)
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sourceCounts = results.map((r, i) => {
    const labels = ['unrest', 'conflict', 'cyber', 'energy', 'outages', 'climate']
    return `${labels[i]}: ${r.status === 'fulfilled' ? 'ok' : 'failed'}`
  })

  return NextResponse.json({
    ingested: count ?? toInsert.length,
    total_fetched: rows.length,
    deduplicated: unique.length,
    new: toInsert.length,
    sources: sourceCounts,
  })
}

// Also support GET for Vercel Cron (crons send GET requests)
export async function GET(req: Request) {
  return POST(req)
}
