/**
 * Immutable Ledger - SHA-256 Hash Chain
 * Implements cryptographic verification of audit trail
 * Pattern from Aqua-Nexus immutable ledger
 */

export interface LedgerBlock {
  id: string;
  previousHash: string;
  timestamp: string;
  eventType: string;
  actor: string;
  data: Record<string, unknown>;
  hash: string;
}

/**
 * Compute SHA-256 hash of a payload
 * Uses Web Crypto API for browser/Node.js compatibility
 */
export async function computeHash(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create a new immutable block in the hash chain
 * previousHash: hash of the previous block (or 'GENESIS' for first block)
 * eventType: type of event (e.g., 'PROPOSAL_CREATED', 'VOTE_CAST', 'PROPOSAL_EXECUTED')
 * actor: wallet address or system identifier of who triggered event
 * data: arbitrary event data to be immutably recorded
 */
export async function createBlock(
  previousHash: string,
  eventType: string,
  actor: string,
  data: Record<string, unknown>
): Promise<LedgerBlock> {
  const timestamp = new Date().toISOString();
  const payload = `${previousHash}|${timestamp}|${eventType}|${actor}|${JSON.stringify(data)}`;
  const hash = await computeHash(payload);

  return {
    id: crypto.randomUUID(),
    previousHash,
    timestamp,
    eventType,
    actor,
    data,
    hash,
  };
}

/**
 * Verify the integrity of a hash chain
 * Returns true if all hashes are valid and chain is unbroken
 * Returns { valid: false, brokenAt: index } if tampering detected
 */
export async function verifyChain(
  blocks: LedgerBlock[]
): Promise<{ valid: boolean; brokenAt?: number }> {
  if (blocks.length === 0) {
    return { valid: true };
  }

  // Verify each block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Reconstruct payload and verify hash
    const payload = `${block.previousHash}|${block.timestamp}|${block.eventType}|${block.actor}|${JSON.stringify(block.data)}`;
    const expectedHash = await computeHash(payload);

    if (expectedHash !== block.hash) {
      return { valid: false, brokenAt: i };
    }

    // Verify chain continuity (except for first block with GENESIS)
    if (i > 0 && block.previousHash !== blocks[i - 1].hash) {
      return { valid: false, brokenAt: i };
    }
  }

  return { valid: true };
}

/**
 * Verify a single block against its neighbors
 */
export async function verifyBlock(
  block: LedgerBlock,
  previousBlock?: LedgerBlock
): Promise<boolean> {
  // Verify block's own hash
  const payload = `${block.previousHash}|${block.timestamp}|${block.eventType}|${block.actor}|${JSON.stringify(block.data)}`;
  const expectedHash = await computeHash(payload);

  if (expectedHash !== block.hash) {
    return false;
  }

  // Verify chain continuity if previous block provided
  if (previousBlock && block.previousHash !== previousBlock.hash) {
    return false;
  }

  return true;
}

/**
 * Generate a genesis block (first block in chain)
 */
export async function createGenesisBlock(
  actor: string,
  data: Record<string, unknown> = {}
): Promise<LedgerBlock> {
  return createBlock('GENESIS', 'GENESIS', actor, data);
}

/**
 * Create proof of integrity for a point in time
 * Returns a hash that can be verified against chain at later time
 */
export async function createProof(blocks: LedgerBlock[]): Promise<string> {
  if (blocks.length === 0) {
    return await computeHash('EMPTY_CHAIN');
  }
  return blocks[blocks.length - 1].hash;
}

/**
 * Verify a historical proof against current state
 */
export async function verifyProof(historicalHash: string, currentBlocks: LedgerBlock[]): Promise<boolean> {
  const currentProof = await createProof(currentBlocks);
  return historicalHash === currentProof;
}
