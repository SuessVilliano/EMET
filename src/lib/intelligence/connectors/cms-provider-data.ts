import type { IntelligenceConnector, SourceRecord } from '../types'

export const cmsProviderDataConnector: IntelligenceConnector = {
  slug: 'cms-provider-data',
  sourceSlug: 'cms-provider-data',
  async fetch(): Promise<SourceRecord[]> {
    const datasetId = process.env.CMS_PROVIDER_DATASET_ID
    if (!datasetId) throw new Error('CMS_PROVIDER_DATASET_ID is required')

    const size = Math.min(Number(process.env.CMS_PROVIDER_PAGE_SIZE || 100), 5000)
    const offset = Number(process.env.CMS_PROVIDER_OFFSET || 0)
    const url = new URL(`https://data.cms.gov/provider-data/api/1/datastore/sql`)
    url.searchParams.set('query', `SELECT * FROM ${datasetId} LIMIT ${size} OFFSET ${offset}`)

    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`CMS Provider Data API ${response.status}: ${await response.text()}`)

    const body = (await response.json()) as { data?: Record<string, unknown>[] }
    const records = body.data || []

    return records.map((payload, index) => {
      const candidateId = payload.CCN || payload.NPI || payload.enrollment_id || payload.facility_id || payload.provider_id
      return {
        externalId: String(candidateId || `${datasetId}:${offset + index}`),
        recordType: 'provider_record',
        sourceUrl: `https://data.cms.gov/provider-data/dataset/${datasetId}`,
        payload,
        metadata: { datasetId, offset: offset + index },
      }
    })
  },
}
