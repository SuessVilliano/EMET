import type { IntelligenceConnector, SourceRecord } from '../types'

const DEFAULT_YEAR = '2024'
const DEFAULT_DATASET = 'acs/acs5'
const DEFAULT_GET = 'NAME,B01001_001E,B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E'

export const censusAcsConnector: IntelligenceConnector = {
  slug: 'census-acs',
  sourceSlug: 'us-census-acs',
  async fetch(): Promise<SourceRecord[]> {
    const apiKey = process.env.CENSUS_API_KEY
    if (!apiKey) throw new Error('CENSUS_API_KEY is required')

    const year = process.env.CENSUS_ACS_YEAR || DEFAULT_YEAR
    const dataset = process.env.CENSUS_ACS_DATASET || DEFAULT_DATASET
    const state = process.env.CENSUS_STATE_FIPS || '12'
    const county = process.env.CENSUS_COUNTY_FIPS || '*'
    const get = process.env.CENSUS_ACS_FIELDS || DEFAULT_GET

    const url = new URL(`https://api.census.gov/data/${year}/${dataset}`)
    url.searchParams.set('get', get)
    url.searchParams.set('for', `county:${county}`)
    url.searchParams.set('in', `state:${state}`)
    url.searchParams.set('key', apiKey)

    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Census API ${response.status}: ${await response.text()}`)

    const rows = (await response.json()) as string[][]
    const [headers, ...values] = rows

    return values.map((row) => {
      const payload = Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      const stateFips = String(payload.state)
      const countyFips = String(payload.county)
      return {
        externalId: `${year}:${dataset}:county:${stateFips}${countyFips}`,
        recordType: 'county_demographics',
        sourceUrl: url.toString().replace(apiKey, 'REDACTED'),
        effectiveAt: `${year}-01-01T00:00:00.000Z`,
        payload,
        metadata: { year, dataset, geography: 'county', stateFips, countyFips },
      }
    })
  },
}
