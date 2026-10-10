import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import { isBearerAuthorized } from '@/lib/intelligence/auth'

export const runtime = 'nodejs'

const responseHeaders = { 'Cache-Control': 'private, no-store' }

function boundedNumber(raw: string | null, fallback: number, min: number, max: number) {
  if (raw === null || raw === '') return fallback
  const value = Number(raw)
  if (!Number.isFinite(value)) return fallback
  return Math.max(min, Math.min(max, value))
}

export async function GET(request: Request) {
  if (!isBearerAuthorized(request, process.env.EMET_SIGNALS_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: responseHeaders })
  }

  const url = new URL(request.url)
  const consumer = url.searchParams.get('consumer')?.trim()
  const type = url.searchParams.get('type')?.trim() || null
  const minScore = boundedNumber(url.searchParams.get('minScore'), 0, 0, 100)
  const limit = Math.floor(boundedNumber(url.searchParams.get('limit'), 25, 1, 100))

  if (!consumer || !/^[a-z0-9-]{2,64}$/.test(consumer)) {
    return NextResponse.json({ error: 'A valid consumer is required' }, { status: 400, headers: responseHeaders })
  }

  const db = createServerClient()
  const { data: app, error: appError } = await db
    .from('consumer_apps')
    .select('allowed_signal_types')
    .eq('slug', consumer)
    .eq('active', true)
    .maybeSingle()

  if (appError) {
    console.error('Signals consumer lookup failed', appError)
    return NextResponse.json({ error: 'Intelligence service unavailable' }, { status: 503, headers: responseHeaders })
  }
  if (!app) {
    return NextResponse.json({ error: 'Unknown consumer' }, { status: 404, headers: responseHeaders })
  }

  const allowed = (app.allowed_signal_types || []) as string[]
  if (type && !allowed.includes(type)) {
    return NextResponse.json({ error: 'Signal type not allowed for consumer' }, { status: 403, headers: responseHeaders })
  }
  if (allowed.length === 0) {
    return NextResponse.json({ consumer, count: 0, signals: [] }, { headers: responseHeaders })
  }

  let query = db
    .from('intelligence_signals')
    .select('id,signal_key,signal_type,title,summary,score,confidence,geography,audience,evidence,detected_at,expires_at,metadata')
    .eq('status', 'active')
    .in('signal_type', allowed)
    .gte('score', minScore)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('score', { ascending: false })
    .order('detected_at', { ascending: false })
    .limit(limit)

  if (type) query = query.eq('signal_type', type)

  const { data, error } = await query
  if (error) {
    console.error('Signals query failed', error)
    return NextResponse.json({ error: 'Intelligence service unavailable' }, { status: 503, headers: responseHeaders })
  }

  return NextResponse.json(
    { consumer, count: data?.length || 0, signals: data || [] },
    { headers: responseHeaders }
  )
}
