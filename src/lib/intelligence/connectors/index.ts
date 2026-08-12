import type { IntelligenceConnector } from '../types'
import { censusAcsConnector } from './census-acs'
import { cmsProviderDataConnector } from './cms-provider-data'

const connectors: Record<string, IntelligenceConnector> = {
  [censusAcsConnector.slug]: censusAcsConnector,
  [cmsProviderDataConnector.slug]: cmsProviderDataConnector,
}

export function getConnector(slug: string): IntelligenceConnector {
  const connector = connectors[slug]
  if (!connector) throw new Error(`Unknown intelligence connector: ${slug}`)
  return connector
}

export function listConnectors() {
  return Object.values(connectors).map(({ slug, sourceSlug }) => ({ slug, sourceSlug }))
}
