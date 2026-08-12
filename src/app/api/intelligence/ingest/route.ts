import { NextResponse } from 'next/server'
import { runIngestion } from '@/lib/intelligence/ingest'
import { listConnectors } from '@/lib/intelligence/connectors'

export const runtime = 'nodejs'

function authorized(request: Request) {
  const secret = process.env.EMET_INGEST_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET() {
  return NextResponse.json({ connectors: listConnectors() })
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { connector?: string }
  if (!body.connector) return NextResponse.json({ error: 'connector is required' }, { status: 400 })

  try {
    const result = await runIngestion(body.connector)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ingestion failed' },
      { status: 500 }
    )
  }
}
