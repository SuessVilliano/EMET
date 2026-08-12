-- EMET Intelligence Backbone hardening / normalization migration
-- Apply after intelligence-schema.sql.

ALTER TABLE facts ADD COLUMN IF NOT EXISTS fact_key TEXT;
ALTER TABLE intelligence_signals ADD COLUMN IF NOT EXISTS signal_key TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'facts_fact_key_unique'
  ) THEN
    ALTER TABLE facts ADD CONSTRAINT facts_fact_key_unique UNIQUE (fact_key);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'intelligence_signals_signal_key_unique'
  ) THEN
    ALTER TABLE intelligence_signals ADD CONSTRAINT intelligence_signals_signal_key_unique UNIQUE (signal_key);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_facts_fact_key ON facts(fact_key);
CREATE INDEX IF NOT EXISTS idx_signals_signal_key ON intelligence_signals(signal_key);

-- These tables are server-side intelligence infrastructure. No anonymous/authenticated
-- Supabase policies are intentionally created here. Service-role clients bypass RLS.
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_apps ENABLE ROW LEVEL SECURITY;

COMMENT ON COLUMN facts.fact_key IS 'Stable idempotency key for a normalized fact across refreshes.';
COMMENT ON COLUMN intelligence_signals.signal_key IS 'Stable idempotency key for an actionable signal across refreshes.';
