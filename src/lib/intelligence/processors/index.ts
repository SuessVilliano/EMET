import { createServerClient } from '@/lib/db/client'
import type { SourceRecord } from '../types'
import { processCensusCountyDemographics } from './census'

type IntelligenceDb = ReturnType<typeof createServerClient>

export type ProcessingSummary = {
  factsUpserted: number
  signalsUpserted: number
  skipped: number
}

export async function processIngestedRecords(
  db: IntelligenceDb,
  connectorSlug: string,
  sourceId: string,
  records: SourceRecord[]
): Promise<ProcessingSummary> {
  switch (connectorSlug) {
    case 'census-acs':
      return processCensusCountyDemographics(db, sourceId, records)
    default:
      return { factsUpserted: 0, signalsUpserted: 0, skipped: 0 }
  }
}
