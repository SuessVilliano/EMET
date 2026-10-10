import { hashPayload } from '../hash'
import type { IntelligenceConnector, SourceRecord } from '../types'

function boundedInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, Math.floor(parsed)))
}

export const cmsProviderDataConnector: IntelligenceConnector = {
  slug: 'cms-provider-data',
  sourceSlug: 'cms-provider-data',
  async fetch(): Promise<SourceRecord[]> {
    const datasetId = process.env.CMS_PROVIDER_DATASET_ID?.trim()
    if (!datasetId) throw new Error('CMS_PROVIDER_DATASET_ID is required')
    if (!/^[a-zA-Z0-9-]+$/.test(datasetId)) throw new Error('CMS_PROVIDER_DATASET_ID has an invalid format')

    const size = boundedInteger(process.env.CMS_PROVIDER_PAGE_SIZE, 250, 1, 1500)
    const offset = boundedInteger(process.env.CMS_PROVIDER_OFFSET, 0, 0, Number.MAX_SAFE_INTEGER)
    const url = new URL(`https://data.cms.gov/provider-data/api/1/datastore/query/${datasetId}/0`)
    url.searchParams.set('limit', String(size))
    url.searchParams.set('offset', String(offset))

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) throw new Error(`CMS Provider Data API ${response.status}: ${await response.text()}`)

    const body = (await response.json()) as {
      results?: Record<string, unknown>[]
      data?: Record<string, unknown>[]
    }
    const records = Array.isArray(body.results) ? body.results : Array.isArray(body.data) ? body.data : []

    return records.map((payload, index) => {
      const candidateId =
        payload.CCN || payload.ccn ||
        payload.NPI || payload.npi ||
        payload.enrollment_id || payload.facility_id || payload.provider_id

      return {
        externalId: String(candidateId || `${datasetId}:${hashPayload(payload)}`),
        recordType: 'provider_record',
        sourceUrl: `https://data.cms.gov/provider-data/dataset/${datasetId}`,
        payload,
        metadata: { datasetId, offset: offset + index, distributionIndex: 0 },
      }
    })
  },
}
