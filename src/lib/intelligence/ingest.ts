import { createServerClient } from '@/lib/db/client'
import { hashPayload } from './hash'
import { getConnector } from './connectors'
import { processIngestedRecords } from './processors'

const WRITE_BATCH_SIZE = 200

export async function runIngestion(connectorSlug: string) {
  const db = createServerClient()
  const connector = getConnector(connectorSlug)

  const { data: source, error: sourceError } = await db
    .from('data_sources')
    .select('id,slug')
    .eq('slug', connector.sourceSlug)
    .eq('active', true)
    .single()
  if (sourceError || !source) throw new Error(`Active source not configured: ${connector.sourceSlug}`)

  const { data: run, error: runError } = await db
    .from('ingestion_runs')
    .insert({ source_id: source.id, connector: connector.slug, status: 'running' })
    .select('id')
    .single()
  if (runError || !run) throw new Error(runError?.message || 'Could not create ingestion run')

  try {
    const records = await connector.fetch()
    const rows = records.map((record) => ({
      source_id: source.id,
      ingestion_run_id: run.id,
      external_id: record.externalId,
      record_type: record.recordType,
      source_url: record.sourceUrl,
      effective_at: record.effectiveAt,
      published_at: record.publishedAt,
      payload: record.payload,
      payload_hash: hashPayload(record.payload),
      metadata: record.metadata || {},
    }))

    let written = 0
    for (let start = 0; start < rows.length; start += WRITE_BATCH_SIZE) {
      const batch = rows.slice(start, start + WRITE_BATCH_SIZE)
      const { data, error } = await db
        .from('raw_records')
        .upsert(batch, { onConflict: 'source_id,external_id,payload_hash', ignoreDuplicates: true })
        .select('id')
      if (error) throw error
      written += data?.length || 0
    }

    const processing = await processIngestedRecords(db, connector.slug, source.id, records)
    const status = processing.skipped > 0 ? 'partial' : 'succeeded'
    const finishedAt = new Date().toISOString()

    const { error: finishError } = await db.from('ingestion_runs').update({
      status,
      finished_at: finishedAt,
      records_seen: records.length,
      records_written: written,
      metadata: { processing },
    }).eq('id', run.id)
    if (finishError) throw finishError

    return {
      runId: run.id,
      connector: connector.slug,
      status,
      recordsSeen: records.length,
      recordsWritten: written,
      processing,
      finishedAt,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await db.from('ingestion_runs').update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      error: message.slice(0, 4000),
    }).eq('id', run.id)
    throw error
  }
}
