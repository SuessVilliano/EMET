-- EMET Platform Database Schema
-- PostgreSQL 13+
-- Includes vector extension for RAG/semantic search

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(44) UNIQUE NOT NULL,
  email VARCHAR(255),
  username VARCHAR(100),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  reputation_score INT DEFAULT 0,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- PRODUCTS MARKETPLACE
-- ============================================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('awg', 'solar', 'food', 'housing')),
  name TEXT NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '{}',
  price DECIMAL(12,2),
  financing_available BOOLEAN DEFAULT FALSE,
  financing_options JSONB,
  reseller_links JSONB DEFAULT '[]',
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_published ON products(published);

-- ============================================================================
-- DAO PROPOSALS AND VOTING
-- ============================================================================

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'standard' CHECK (type IN ('standard', 'parameter_change', 'kill_switch')),
  creator_wallet VARCHAR(44) REFERENCES users(wallet_address) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VOTING', 'PASSED', 'FAILED', 'EXECUTED')),
  voting_start_at TIMESTAMP,
  voting_end_at TIMESTAMP,
  execution_data JSONB,
  yes_count INT DEFAULT 0,
  no_count INT DEFAULT 0,
  abstain_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_creator ON proposals(creator_wallet);
CREATE INDEX idx_proposals_type ON proposals(type);
CREATE INDEX idx_proposals_voting_end ON proposals(voting_end_at) WHERE status = 'VOTING';

-- ============================================================================
-- VOTES (ONE VOTE PER USER PER PROPOSAL)
-- ============================================================================

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  wallet_address VARCHAR(44) NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  vote VARCHAR(10) NOT NULL CHECK (vote IN ('YES', 'NO', 'ABSTAIN')),
  signature TEXT NOT NULL,
  timestamp BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(proposal_id, wallet_address)
);

CREATE INDEX idx_votes_proposal ON votes(proposal_id);
CREATE INDEX idx_votes_wallet ON votes(wallet_address);

-- ============================================================================
-- CONTENT PUBLISHING & SCHEDULING
-- ============================================================================

CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) CHECK (type IN ('tweet', 'meme', 'blog', 'video')),
  title TEXT,
  body TEXT NOT NULL,
  media_url TEXT,
  status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'published')),
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  platforms TEXT[] DEFAULT ARRAY['twitter'],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_published_at ON content(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_content_scheduled_at ON content(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- ============================================================================
-- MESSAGING & CHANNELS
-- ============================================================================

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private', 'dm')),
  member_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_channels_type ON channels(type);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_wallet VARCHAR(44) REFERENCES users(wallet_address) ON DELETE SET NULL,
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_user_wallet ON messages(user_wallet);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- NEWS ALERTS & THREAT TRACKING
-- ============================================================================

CREATE TABLE news_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100),
  title TEXT NOT NULL,
  summary TEXT,
  threat_level VARCHAR(20) CHECK (threat_level IN ('critical', 'high', 'medium', 'low')),
  category VARCHAR(50) CHECK (category IN ('water', 'energy', 'food', 'housing', 'finance', 'legal')),
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_alerts_threat_level ON news_alerts(threat_level);
CREATE INDEX idx_news_alerts_category ON news_alerts(category);
CREATE INDEX idx_news_alerts_created_at ON news_alerts(created_at);

-- ============================================================================
-- LEGAL DOCUMENTS (RAG / SEMANTIC SEARCH)
-- ============================================================================

CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100),
  title TEXT NOT NULL,
  content TEXT,
  embeddings vector(1536),
  category VARCHAR(50),
  section_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX legal_documents_embeddings_idx ON legal_documents USING ivfflat (embeddings vector_cosine_ops);
CREATE INDEX idx_legal_documents_category ON legal_documents(category);
CREATE INDEX idx_legal_documents_source ON legal_documents(source);

-- ============================================================================
-- UPLOADED DOCUMENTS (USER UPLOADS: PDFS, FILINGS, EVIDENCE, GUIDELINES)
-- ============================================================================

CREATE TABLE uploaded_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  uploaded_by VARCHAR(44) REFERENCES users(wallet_address) ON DELETE SET NULL,
  category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('legal', 'case', 'guidelines', 'evidence', 'other')),
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'indexed', 'failed')),
  content_text TEXT,
  chunk_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_uploaded_documents_status ON uploaded_documents(status);
CREATE INDEX idx_uploaded_documents_category ON uploaded_documents(category);
CREATE INDEX idx_uploaded_documents_uploaded_by ON uploaded_documents(uploaded_by);
CREATE INDEX idx_uploaded_documents_created_at ON uploaded_documents(created_at);

-- ============================================================================
-- IMMUTABLE AUDIT LOG (SHA-256 HASH CHAIN)
-- ============================================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  previous_hash VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  event_type VARCHAR(100) NOT NULL,
  actor VARCHAR(44),
  data JSONB,
  hash VARCHAR(64) NOT NULL UNIQUE,
  synced_to_solana BOOLEAN DEFAULT FALSE,
  solana_signature VARCHAR(88),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_hash ON audit_log(hash);
CREATE INDEX idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX idx_audit_log_actor ON audit_log(actor);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_synced ON audit_log(synced_to_solana) WHERE synced_to_solana = FALSE;

-- ============================================================================
-- KILL SWITCH VOTING
-- ============================================================================

CREATE TABLE kill_switch_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(44) NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  signature TEXT NOT NULL,
  timestamp BIGINT,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wallet_address)
);

CREATE INDEX idx_kill_switch_votes_wallet ON kill_switch_votes(wallet_address);
CREATE INDEX idx_kill_switch_votes_created_at ON kill_switch_votes(created_at);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active proposals with vote counts
CREATE VIEW active_proposals AS
SELECT
  p.id,
  p.title,
  p.type,
  p.status,
  p.creator_wallet,
  p.yes_count,
  p.no_count,
  p.abstain_count,
  (p.yes_count + p.no_count + p.abstain_count) as total_votes,
  p.voting_start_at,
  p.voting_end_at,
  p.created_at
FROM proposals p
WHERE p.status IN ('ACTIVE', 'VOTING');

-- User reputation rankings
CREATE VIEW user_rankings AS
SELECT
  u.id,
  u.wallet_address,
  u.username,
  u.reputation_score,
  ROW_NUMBER() OVER (ORDER BY u.reputation_score DESC) as rank
FROM users u
WHERE u.reputation_score > 0
ORDER BY u.reputation_score DESC;

-- ============================================================================
-- COMMENTS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp on users table
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Auto-update updated_at timestamp on proposals table
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at_trigger
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_proposals_updated_at();

-- Auto-update updated_at timestamp on content table
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_updated_at_trigger
BEFORE UPDATE ON content
FOR EACH ROW
EXECUTE FUNCTION update_content_updated_at();

-- Auto-update channel member_count when messages are added
CREATE OR REPLACE FUNCTION update_channel_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE channels
  SET member_count = (
    SELECT COUNT(DISTINCT user_wallet)
    FROM messages
    WHERE channel_id = NEW.channel_id
  )
  WHERE id = NEW.channel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_member_count
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_channel_member_count();
