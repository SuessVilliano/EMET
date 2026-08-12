# EMET Intelligence Backbone

EMET's intelligence layer separates authoritative source data from AI interpretation. Models may summarize, classify, explain, and rank evidence; they must not manufacture source facts.

## Pipeline

`official source -> connector -> raw_records -> normalization/entity resolution -> facts/events -> signals -> consumer APIs`

Every normalized fact/event should retain evidence links to one or more immutable source snapshots.

## First consumers

- EMET chat/RAG: evidence-grounded answers with source provenance.
- Smart Life Brokers: non-sensitive market intelligence such as demographic, provider-access, coverage-market, and regulatory signals.

Smart Life must not use EMET to infer sensitive personal traits or eligibility. Individual insurance/financial qualification begins only after appropriate consumer interaction/consent and remains subject to licensing/compliance requirements.

## Setup

1. Apply `src/lib/db/schema.sql` to Supabase if not already applied.
2. Apply `src/lib/db/intelligence-schema.sql`.
3. Add environment variables:
   - `EMET_INGEST_SECRET`
   - `CENSUS_API_KEY`
   - `CENSUS_ACS_YEAR` (optional; default 2024)
   - `CENSUS_STATE_FIPS` (optional; default 12 / Florida)
   - `CENSUS_COUNTY_FIPS` (optional; default `*`)
   - `CMS_PROVIDER_DATASET_ID` for the selected official Provider Data Catalog dataset
   - `CMS_PROVIDER_PAGE_SIZE` (optional)
4. Deploy.
5. Trigger ingestion with `POST /api/intelligence/ingest` and `Authorization: Bearer <EMET_INGEST_SECRET>` using `{ "connector": "census-acs" }` or `{ "connector": "cms-provider-data" }`.
6. Read downstream signals from `/api/intelligence/signals?consumer=smart-life-brokers`.

## Connector policy

A production connector must:

- use an official or properly licensed source;
- record a stable external identifier when available;
- preserve the raw source payload;
- retain a source URL and retrieval timestamp;
- avoid putting API keys into stored source URLs;
- be idempotent through `source_id + external_id + payload_hash`;
- fail visibly through `ingestion_runs` rather than silently fabricating fallback data.

## Next implementation tranche

1. Add normalization for Census county demographics and generate `market_demographic` signals (including retirement-age market measures at aggregate geography level).
2. Select and pin the CMS datasets needed by Smart Life, normalize providers/coverage geography, and generate `provider_access` / `coverage_market` signals.
3. Add Florida official-source connectors only after verifying source access/terms. Prefer stable APIs/downloads; use scraping only where legally/technically appropriate and resilient.
4. Ground EMET chat on `facts`/`raw_records` and return evidence/citations with answers.
5. Add scheduled ingestion (Vercel Cron or a worker) with connector-specific refresh frequencies.
6. Add API authentication/rate limiting for external consumers before Smart Life production traffic.
7. Add observability: stale-source alerts, run failure alerts, row counts, latency, and schema-drift detection.

## Smart Life contract

Smart Life consumes EMET as an intelligence service; it does not share EMET's database directly. The first stable contract is the signals endpoint. This keeps EMET independently reusable by LIV8 and future Hybrid Holdings companies.
