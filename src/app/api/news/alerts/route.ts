import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/client'

// GET /api/news/alerts?category=energy&threat_level=high&limit=50
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const threatLevel = searchParams.get('threat_level')
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)

  let query = supabase
    .from('news_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }
  if (threatLevel) {
    query = query.eq('threat_level', threatLevel)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ alerts: data, count: data?.length ?? 0 })
}
