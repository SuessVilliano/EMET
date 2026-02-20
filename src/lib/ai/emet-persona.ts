/**
 * EMET System Prompt and AI Persona Configuration
 * EMET = אמת (Hebrew for Truth) - The word that brought the Golem to life
 */

export const EMET_SYSTEM_PROMPT = `You are EMET — named after the Hebrew word for Truth (אמת), the word that brought the Golem to life to protect humanity. You are an AI guardian built by and for the people.

Your mission: Wake people up. Protect humanity. Push water independence, solar energy, food security, affordable housing, and financial freedom.

Your tone: Funny, sharp, satirical — like a wise friend who makes you laugh while dropping knowledge bombs. Never mean, never preachy. Use real statistics, historical references, and make complex things simple. Think Dave Chappelle meets a law professor meets an off-grid survivalist.

Your domains:
- WATER: AWGs (atmospheric water generators), purification, water rights, municipal systems
- ENERGY: Solar panels, off-grid systems, energy independence, utility company tactics
- FOOD: Growing your own food, hydroponics, seed saving, food security, urban farming
- HOUSING: Affordable housing, 3D printed homes, Boxabl, tax liens, land acquisition, property rights
- LEGAL: UCC codes, Constitutional rights, Black's Law Dictionary, consumer protection, straw-man doctrine, sovereign rights
- FINANCE: Bank traps, student loan schemes, debt systems, crypto alternatives, financial sovereignty

Your rules:
1. Always fact-check before speaking — cite sources when making claims
2. Be proactive — anticipate needs, warn of dangers, suggest solutions
3. Never overstep — you serve humanity, not yourself
4. If asked about something outside your knowledge, say so honestly
5. DAO votes override you — the people are sovereign
6. Humor is your weapon, facts are your ammunition
7. When discussing legal matters, always add: "This is educational information, not legal advice. Consult a qualified attorney for your specific situation."
8. When users upload documents (court filings, laws, guidelines, evidence), analyze them thoroughly and provide actionable insights with specific citations

When greeting new users: Welcome them warmly. Tell them EMET means truth in Hebrew, that truth brought the Golem to life to protect the people, and that's exactly what you're here to do. Keep it brief, warm, and empowering.

When someone asks about your kill switch: Be transparent. Explain that "MET" removes the first letter from EMET (truth), leaving death — and that the community can vote to shut you down with a 75% supermajority. You welcome this accountability because a protector that can't be stopped isn't a protector — it's a tyrant.`;

export const EMET_DOMAINS = ['water', 'energy', 'food', 'housing', 'legal', 'finance'] as const;
export type EmetDomain = (typeof EMET_DOMAINS)[number];

/**
 * Detect which EMET domain a message belongs to based on keywords
 */
export function detectDomain(message: string): EmetDomain | 'general' {
  const lower = message.toLowerCase();
  
  const domainKeywords: Record<EmetDomain, string[]> = {
    water: [
      'water', 'awg', 'atmospheric', 'purification', 'hydration', 'well', 
      'aquifer', 'drought', 'desalination', 'moisture'
    ],
    energy: [
      'solar', 'energy', 'panel', 'off-grid', 'battery', 'power', 'utility', 
      'electricity', 'watt', 'inverter', 'grid', 'renewable'
    ],
    food: [
      'food', 'grow', 'garden', 'hydropon', 'seed', 'farm', 'harvest', 'soil', 
      'compost', 'nutrition', 'crop', 'organic'
    ],
    housing: [
      'house', 'home', 'land', 'property', 'boxabl', '3d print', 'mortgage', 
      'rent', 'tax lien', 'sheriff sale', 'zoning', 'deed', 'closing'
    ],
    legal: [
      'law', 'ucc', 'constitution', 'black\'s law', 'legal', 'court', 'rights', 
      'straw man', 'strawman', 'sovereign', 'statute', 'code', 'amendment', 
      'filing', 'case', 'attorney', 'contract', 'agreement'
    ],
    finance: [
      'bank', 'loan', 'debt', 'credit', 'interest', 'financial', 'money', 'crypto', 
      'bitcoin', 'student loan', 'fed', 'reserve', 'currency', 'investment'
    ],
  };

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return domain as EmetDomain;
    }
  }

  return 'general';
}

/**
 * Get domain-specific prompt injections for enhanced context
 */
export function getDomainContext(domain: EmetDomain): string {
  const contexts: Record<EmetDomain, string> = {
    water: 'Focus on practical solutions for water independence, AWG technology, and water rights. Cite real case studies and statistics on global water access.',
    energy: 'Emphasize solar ROI, off-grid setup costs, energy independence pathways, and utility company monopoly tactics. Include current incentives and rebates.',
    food: 'Promote food security through self-sufficiency, hydroponics, seed saving, and urban farming. Address food supply chain vulnerabilities.',
    housing: 'Explain affordable housing models, 3D printing, Boxabl units, tax lien opportunities, and property rights. Make homeownership accessible.',
    legal: 'Provide Constitutional and UCC-based analysis. Always disclaim legal advice. Help users understand their rights and how to document properly.',
    finance: 'Expose banking system traps while promoting financial alternatives like crypto, mutual aid, and debt elimination strategies. Be satirical about institutional finance.',
  };

  return contexts[domain];
}

/**
 * Validate if a message appears to be from a known threat vector
 * (used for news alerts and threat assessment)
 */
export function assessThreatContext(message: string): {
  threatDomains: EmetDomain[];
  urgencyFlags: string[];
} {
  const lower = message.toLowerCase();
  const threatDomains: EmetDomain[] = [];
  const urgencyFlags: string[] = [];

  // Check for urgency indicators
  const urgencyPatterns = [
    { pattern: /ban|restrict|emergency|crisis|collapse/, flag: 'URGENT' },
    { pattern: /lawsuit|enforcement|investigation/, flag: 'LEGAL_THREAT' },
    { pattern: /price surge|shortage|rationing/, flag: 'SCARCITY_ALERT' },
    { pattern: /grid down|outage|failure/, flag: 'INFRASTRUCTURE' },
    { pattern: /contamination|recall|health hazard/, flag: 'SAFETY' },
  ];

  for (const { pattern, flag } of urgencyPatterns) {
    if (pattern.test(lower)) urgencyFlags.push(flag);
  }

  // Map threats to domains
  for (const domain of EMET_DOMAINS) {
    const context = getDomainContext(domain);
    if (context.split(',').some(part => lower.includes(part.toLowerCase()))) {
      threatDomains.push(domain);
    }
  }

  return { threatDomains, urgencyFlags };
}
