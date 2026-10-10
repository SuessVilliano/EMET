-- EMET Intelligence Backbone
-- Apply after schema.sql. Designed for provenance-first public-data ingestion.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  authority TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('government_api','government_dataset','licensed_api','rss','manual')),
  base_url TEXT NOT NULL,
  terms_url TEXT,
  jurisdiction TEXT,
  refresh_policy TEXT NOT NULL DEFAULT 'daily',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  connector TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','succeeded','partial','failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  records_seen INT NOT NULL DEFAULT 0,
  records_written INT NOT NULL DEFAULT 0,
  cursor JSONB,
  error TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_source_started ON ingestion_runs(source_id, started_at DESC);

CREATE TABLE IF NOT EXISTS raw_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE RESTRICT,
  ingestion_run_id UUID REFERENCES ingestion_runs(id) ON DELETE SET NULL,
  external_id TEXT NOT NULL,
  record_type TEXT NOT NULL,
  source_url TEXT,
  effective_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL,
  payload_hash TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE(source_id, external_id, payload_hash)
);
CREATE INDEX IF NOT EXISTS idx_raw_records_source_type ON raw_records(source_id, record_type);
CREATE INDEX IF NOT EXISTS idx_raw_records_retrieved ON raw_records(retrieved_at DESC);

CREATE TABLE IF NOT EXISTS intelligence_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('place','organization','provider','program','dataset','market','other')),
  canonical_name TEXT NOT NULL,
  canonical_key TEXT UNIQUE,
  attributes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_intelligence_entities_type ON intelligence_entities(entity_type);

CREATE TABLE IF NOT EXISTS entity_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES intelligence_entities(id) ON DELETE CASCADE,
  source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  external_id TEXT,
  UNIQUE(entity_id, source_id, alias)
);

CREATE TABLE IF NOT EXISTS facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES intelligence_entities(id) ON DELETE CASCADE,
  predicate TEXT NOT NULL,
  value JSONB NOT NULL,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','superseded','disputed')),
  metadata JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_facts_entity_predicate ON facts(entity_id, predicate);

CREATE TABLE IF NOT EXISTS fact_evidence (
  fact_id UUID NOT NULL REFERENCES facts(id) ON DELETE CASCADE,
  raw_record_id UUID NOT NULL REFERENCES raw_records(id) ON DELETE CASCADE,
  evidence_path TEXT,
  PRIMARY KEY (fact_id, raw_record_id)
);

CREATE TABLE IF NOT EXISTS intelligence_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES intelligence_entities(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  occurred_at TIMESTAMPTZ,
  geography JSONB,
  attributes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_evidence (
  event_id UUID NOT NULL REFERENCES intelligence_events(id) ON DELETE CASCADE,
  raw_record_id UUID NOT NULL REFERENCES raw_records(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, raw_record_id)
);

CREATE TABLE IF NOT EXISTS signal_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  consumer TEXT NOT NULL DEFAULT 'emet',
  description TEXT,
  rule JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS intelligence_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES signal_rules(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES intelligence_entities(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  confidence NUMERIC(4,3) NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  geography JSONB,
  audience JSONB NOT NULL DEFAULT '{}',
  evidence JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','dismissed')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_signals_consumer ON intelligence_signals(signal_type, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_score ON intelligence_signals(score DESC, detected_at DESC);

CREATE TABLE IF NOT EXISTS consumer_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  allowed_signal_types TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO data_sources (slug, name, authority, source_type, base_url, jurisdiction, refresh_policy)
VALUES
  ('us-census-acs', 'American Community Survey', 'U.S. Census Bureau', 'government_api', 'https://api.census.gov/data', 'United States', 'annual'),
  ('cms-provider-data', 'Provider Data Catalog', 'Centers for Medicare & Medicaid Services', 'government_api', 'https://data.cms.gov/provider-data/api/1', 'United States', 'daily')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO consumer_apps (slug, name, allowed_signal_types)
VALUES ('smart-life-brokers', 'Smart Life Brokers', ARRAY['market_demographic','provider_access','coverage_market','regulatory_change'])
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE raw_records IS 'Immutable-ish source snapshots. Never replace provenance with LLM-generated facts.';
COMMENT ON TABLE facts IS 'Normalized claims backed by one or more raw source records.';
COMMENT ON TABLE intelligence_signals IS 'Actionable, non-sensitive market intelligence for downstream apps such as Smart Life Brokers.';
