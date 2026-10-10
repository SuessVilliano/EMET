import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { runIngestion } from '@/lib/intelligence/ingest'
import { listConnectors } from '@/lib/intelligence/connectors'
import { isBearerAuthorized } from '@/lib/intelligence/auth'

export const runtime = 'nodejs'

const responseHeaders = { 'Cache-Control': 'private, no-store' }

function authorized(request: Request) {
  return isBearerAuthorized(request, process.env.EMET_INGEST_SECRET)
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: responseHeaders })
  }
  return NextResponse.json({ connectors: listConnectors() }, { headers: responseHeaders })
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: responseHeaders })
  }

  const body = await request.json().catch(() => ({})) as { connector?: unknown }
  const connector = typeof body.connector === 'string' ? body.connector.trim() : ''
  if (!connector) {
    return NextResponse.json({ error: 'connector is required' }, { status: 400, headers: responseHeaders })
  }

  const known = listConnectors().some((item) => item.slug === connector)
  if (!known) {
    return NextResponse.json({ error: 'Unknown connector' }, { status: 400, headers: responseHeaders })
  }

  try {
    const result = await runIngestion(connector)
    return NextResponse.json(result, { headers: responseHeaders })
  } catch (error) {
    const requestId = randomUUID()
    console.error(`Intelligence ingestion failed [${requestId}]`, error)
    return NextResponse.json(
      { error: 'Ingestion failed', requestId },
      { status: 500, headers: responseHeaders }
    )
  }
}
