import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const consumer = url.searchParams.get('consumer') || 'emet'
  const type = url.searchParams.get('type')
  const minScore = Math.max(0, Math.min(100, Number(url.searchParams.get('minScore') || 0)))
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') || 25)))

  const db = createServerClient()
  const { data: app } = await db
    .from('consumer_apps')
    .select('allowed_signal_types')
    .eq('slug', consumer)
    .eq('active', true)
    .maybeSingle()

  let query = db
    .from('intelligence_signals')
    .select('id,signal_type,title,summary,score,confidence,geography,audience,evidence,detected_at,expires_at,metadata')
    .eq('status', 'active')
    .gte('score', minScore)
    .order('score', { ascending: false })
    .order('detected_at', { ascending: false })
    .limit(limit)

  const allowed = (app?.allowed_signal_types || []) as string[]
  if (consumer !== 'emet' && allowed.length === 0) return NextResponse.json({ consumer, signals: [] })
  if (allowed.length) query = query.in('signal_type', allowed)
  if (type) {
    if (allowed.length && !allowed.includes(type)) return NextResponse.json({ error: 'Signal type not allowed for consumer' }, { status: 403 })
    query = query.eq('signal_type', type)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ consumer, count: data?.length || 0, signals: data || [] })
}
