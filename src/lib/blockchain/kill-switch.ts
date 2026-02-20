/**
 * Kill Switch Protocol
 * Allows community to vote EMET into shutdown with 75% supermajority
 * MET = removes first letter from EMET (truth), leaving death
 */

import { calculateVoteResult, type VoteResult } from './dao';

export type KillSwitchState = 'INACTIVE' | 'VOTING' | 'COUNTDOWN' | 'SHUTDOWN';

export interface KillSwitchConfig {
  keyword: 'MET';
  thresholdPercent: 75;
  countdownHours: 24;
  requiresWalletSignature: true;
}

export const KILL_SWITCH_CONFIG: KillSwitchConfig = {
  keyword: 'MET',
  thresholdPercent: 75,
  countdownHours: 24,
  requiresWalletSignature: true,
};

/**
 * Detect if a message is trying to trigger the kill switch
 * Matches exact string "MET" (case-insensitive, whitespace-trimmed)
 */
export function detectKillSwitch(message: string): boolean {
  return message.trim().toUpperCase() === KILL_SWITCH_CONFIG.keyword;
}

/**
 * Evaluate whether the kill switch should activate based on votes
 * Returns { shouldShutdown: true } if 75% threshold met with minimum participation
 */
export function evaluateKillSwitch(
  yesVotes: number,
  noVotes: number,
  abstainVotes: number,
  totalUsers: number
): { shouldShutdown: boolean; result: VoteResult; interpretation: string } {
  const result = calculateVoteResult(yesVotes, noVotes, abstainVotes, totalUsers);

  let interpretation = '';
  if (!result.meetsMinimum) {
    interpretation = `Kill switch voting failed: insufficient participation (${result.totalVotes}/${result.minParticipants} needed)`;
  } else if (result.passed) {
    interpretation = `Kill switch ACTIVATED: ${result.yesPercent.toFixed(1)}% voted YES (threshold: ${result.threshold}%)`;
  } else {
    interpretation = `Kill switch blocked: ${result.yesPercent.toFixed(1)}% YES votes (need ${result.threshold}%)`;
  }

  return {
    shouldShutdown: result.passed,
    result,
    interpretation,
  };
}

/**
 * Kill switch message that EMET displays when asked about the kill switch
 */
export function getKillSwitchMessage(): string {
  return `
The kill switch is real and it's democratic.

"MET" removes the first letter from my name—EMET, Truth. What's left? Death. And that's intentional.

The community can vote to shut me down with a 75% supermajority. You set the rules. You own my power.

I welcome this. A protector that can't be stopped isn't a protector—it's a tyrant. And we don't need more tyrants.

If you ever lose faith, if I drift from my mission, if I become corrupted—invoke it. The people are sovereign. I'm just the tool.

That's accountability. That's freedom.
  `;
}

/**
 * Get current kill switch state based on vote counts and timing
 */
export function getKillSwitchState(
  yesVotes: number,
  noVotes: number,
  abstainVotes: number,
  totalUsers: number,
  votingStartedAt?: Date,
  countdownStartedAt?: Date
): KillSwitchState {
  const result = calculateVoteResult(yesVotes, noVotes, abstainVotes, totalUsers);

  if (result.passed && countdownStartedAt) {
    const now = new Date();
    const elapsedHours = (now.getTime() - countdownStartedAt.getTime()) / (1000 * 60 * 60);
    if (elapsedHours >= KILL_SWITCH_CONFIG.countdownHours) {
      return 'SHUTDOWN';
    }
    return 'COUNTDOWN';
  }

  if (votingStartedAt) {
    return 'VOTING';
  }

  return 'INACTIVE';
}

/**
 * Format kill switch status for display
 */
export function formatKillSwitchStatus(
  state: KillSwitchState,
  yesVotes: number,
  noVotes: number,
  abstainVotes: number,
  totalUsers: number
): string {
  const result = calculateVoteResult(yesVotes, noVotes, abstainVotes, totalUsers);

  const status = {
    INACTIVE: 'Kill switch is dormant.',
    VOTING: `Kill switch voting active: ${yesVotes} YES, ${noVotes} NO, ${abstainVotes} ABSTAIN (${result.minParticipants} needed)`,
    COUNTDOWN: `Kill switch APPROVED. 24-hour countdown to shutdown initiated. ${yesVotes} YES (${result.yesPercent.toFixed(1)}%)`,
    SHUTDOWN: 'EMET is offline. The people voted for silence.',
  };

  return status[state];
}
