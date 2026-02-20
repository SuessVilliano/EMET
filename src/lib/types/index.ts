/**
 * EMET Platform - Shared TypeScript Types
 * All core entities and domain models
 */

// User entity
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  username?: string;
  role: 'member' | 'admin' | 'moderator';
  reputation_score: number;
  verified_at?: string;
  created_at: string;
}

// Proposal types and statuses
export type ProposalType = 'standard' | 'parameter_change' | 'kill_switch';
export type ProposalStatus = 'ACTIVE' | 'VOTING' | 'PASSED' | 'FAILED' | 'EXECUTED';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: ProposalType;
  creator_wallet: string;
  status: ProposalStatus;
  voting_start_at: string;
  voting_end_at: string;
  execution_data?: Record<string, unknown>;
  yes_count: number;
  no_count: number;
  abstain_count: number;
  created_at: string;
}

// Vote entity
export type VoteChoice = 'YES' | 'NO' | 'ABSTAIN';

export interface Vote {
  id: string;
  proposal_id: string;
  wallet_address: string;
  vote: VoteChoice;
  signature: string;
  timestamp: number;
}

// Product entity for marketplace
export type ProductCategory = 'awg' | 'solar' | 'food' | 'housing';

export interface ResellerLink {
  site: string;
  url: string;
}

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  specs: Record<string, unknown>;
  price: number;
  financing_available: boolean;
  financing_options?: Record<string, unknown>;
  reseller_links: ResellerLink[];
  image_url?: string;
  published: boolean;
}

// Content item for publishing
export type ContentType = 'tweet' | 'meme' | 'blog' | 'video';
export type ContentStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'published';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  media_url?: string;
  status: ContentStatus;
  scheduled_at?: string;
  published_at?: string;
  platforms: string[];
}

// Chat message
export interface Message {
  id: string;
  channel_id: string;
  user_wallet: string;
  content: string;
  attachments?: Record<string, unknown>;
  created_at: string;
}

// Chat channel
export type ChannelType = 'public' | 'private' | 'dm';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  member_count: number;
}

// News alert for water/energy/food/housing threats
export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low';
export type NewsCategory = 'water' | 'energy' | 'food' | 'housing' | 'finance' | 'legal';

export interface NewsAlert {
  id: string;
  source: string;
  title: string;
  summary: string;
  threat_level: ThreatLevel;
  category: NewsCategory;
  url?: string;
  created_at: string;
}

// Legal document for RAG system
export interface LegalDocument {
  id: string;
  source: string;
  title: string;
  content: string;
  category: string;
  section_reference?: string;
  created_at: string;
}

// Audit log entry for immutable record
export interface AuditLogEntry {
  id: string;
  previous_hash: string;
  timestamp: string;
  event_type: string;
  actor: string;
  data: Record<string, unknown>;
  hash: string;
  synced_to_solana: boolean;
  solana_signature?: string;
}

// Kill switch status
export type KillSwitchState = 'inactive' | 'voting' | 'shutdown';

export interface KillSwitchStatus {
  active: boolean;
  total_votes: number;
  yes_votes: number;
  no_votes: number;
  threshold_percent: number;
  min_participants: number;
  total_users: number;
  status: KillSwitchState;
}

// Uploaded document (user PDFs, legal filings, evidence, guidelines)
export type DocumentCategory = 'legal' | 'case' | 'guidelines' | 'evidence' | 'other';
export type DocumentStatus = 'processing' | 'indexed' | 'failed';

export interface UploadedDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  category: DocumentCategory;
  status: DocumentStatus;
  chunk_count?: number;
  created_at: string;
}
