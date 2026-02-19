/**
 * DAO Voting Logic
 * 75% supermajority threshold with scaled minimum participation
 */

export interface VoteResult {
  passed: boolean;
  yesCount: number;
  noCount: number;
  abstainCount: number;
  totalVotes: number;
  yesPercent: number;
  threshold: number;
  minParticipants: number;
  totalUsers: number;
  meetsMinimum: boolean;
}

/**
 * Calculate minimum participants based on total users (scaled)
 * - Under 100: minimum 10 votes
 * - 100-1000: 5% of users
 * - Over 1000: 3% of users
 */
export function calculateMinParticipants(totalUsers: number): number {
  if (totalUsers < 100) {
    return Math.min(10, totalUsers);
  }
  if (totalUsers < 1000) {
    return Math.ceil(totalUsers * 0.05);
  }
  return Math.ceil(totalUsers * 0.03);
}

/**
 * Calculate vote result with 75% supermajority requirement
 * Abstain votes do NOT count toward the 75% threshold
 * Only YES and NO votes determine the percentage
 */
export function calculateVoteResult(
  yesCount: number,
  noCount: number,
  abstainCount: number,
  totalUsers: number
): VoteResult {
  const totalVotes = yesCount + noCount + abstainCount;
  const votingVotes = yesCount + noCount; // Abstains excluded from threshold calculation
  const yesPercent = votingVotes > 0 ? (yesCount / votingVotes) * 100 : 0;
  const threshold = 75;
  const minParticipants = calculateMinParticipants(totalUsers);
  const meetsMinimum = totalVotes >= minParticipants;
  const passed = meetsMinimum && yesPercent >= threshold;

  return {
    passed,
    yesCount,
    noCount,
    abstainCount,
    totalVotes,
    yesPercent,
    threshold,
    minParticipants,
    totalUsers,
    meetsMinimum,
  };
}

/**
 * Evaluate if a proposal should be considered "failed" (insufficient participation or low support)
 */
export function evaluateProposalState(
  yesCount: number,
  noCount: number,
  abstainCount: number,
  totalUsers: number
): {
  status: 'PASSED' | 'FAILED' | 'INSUFFICIENT_PARTICIPATION';
  result: VoteResult;
} {
  const result = calculateVoteResult(yesCount, noCount, abstainCount, totalUsers);

  if (!result.meetsMinimum) {
    return { status: 'INSUFFICIENT_PARTICIPATION', result };
  }

  return { status: result.passed ? 'PASSED' : 'FAILED', result };
}

/**
 * Format vote result for human-readable output
 */
export function formatVoteResult(result: VoteResult): string {
  const percentage = result.yesPercent.toFixed(1);
  const participation = ((result.totalVotes / result.totalUsers) * 100).toFixed(1);

  return (
    `Vote Result:\n` +
    `YES: ${result.yesCount} (${percentage}%)\n` +
    `NO: ${result.noCount}\n` +
    `ABSTAIN: ${result.abstainCount}\n` +
    `Total Votes: ${result.totalVotes}/${result.minParticipants} (${participation}% participation)\n` +
    `Threshold: ${result.threshold}%\n` +
    `Status: ${result.passed ? 'PASSED' : result.meetsMinimum ? 'FAILED' : 'INSUFFICIENT_PARTICIPATION'}`
  );
}
