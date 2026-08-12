import { createServerClient } from '@/lib/db/client'
import { hashPayload } from './hash'
import { getConnector } from './connectors'

export async function runIngestion(connectorSlug: string) {
  const db = createServerClient()
  const connector = getConnector(connectorSlug)

  const { data: source, error: sourceError } = await db
    .from('data_sources')
    .select('id,slug')
    .eq('slug', connector.sourceSlug)
    .single()
  if (sourceError || !source) throw new Error(`Source not configured: ${connector.sourceSlug}`)

  const { data: run, error: runError } = await db
    .from('ingestion_runs')
    .insert({ source_id: source.id, connector: connector.slug, status: 'running' })
    .select('id')
    .single()
  if (runError || !run) throw new Error(runError?.message || 'Could not create ingestion run')

  try {
    const records = await connector.fetch()
    let written = 0

    for (const record of records) {
      const payloadHash = hashPayload(record.payload)
      const { error } = await db.from('raw_records').upsert(
        {
          source_id: source.id,
          ingestion_run_id: run.id,
          external_id: record.externalId,
          record_type: record.recordType,
          source_url: record.sourceUrl,
          effective_at: record.effectiveAt,
          published_at: record.publishedAt,
          payload: record.payload,
          payload_hash: payloadHash,
          metadata: record.metadata || {},
        },
        { onConflict: 'source_id,external_id,payload_hash', ignoreDuplicates: true }
      )
      if (error) throw error
      written += 1
    }

    await db.from('ingestion_runs').update({
      status: 'succeeded',
      finished_at: new Date().toISOString(),
      records_seen: records.length,
      records_written: written,
    }).eq('id', run.id)

    return { runId: run.id, connector: connector.slug, recordsSeen: records.length, recordsWritten: written }
  } catch (error) {
    await db.from('ingestion_runs').update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    }).eq('id', run.id)
    throw error
  }
}
