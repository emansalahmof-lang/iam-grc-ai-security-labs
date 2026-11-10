/**
 * Pure, dependency-free scoring logic for the interactive tools.
 *
 * Every function here is deterministic and unit-tested (tests/scoring.test.ts),
 * and every method is also described in plain language on the tool's page so
 * visitors can reproduce results by hand. No data leaves the browser.
 */

/* ------------------------------------------------------------------ */
/* Generic helpers                                                     */
/* ------------------------------------------------------------------ */

export function assertIntInRange(value: number, min: number, max: number, name: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}; received ${value}`);
  }
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* Maturity assessment (0–4 scale per question)                        */
/* ------------------------------------------------------------------ */

export const MATURITY_LEVELS = ['0 · Non-existent', '1 · Initial', '2 · Repeatable', '3 · Defined', '4 · Managed & measured'] as const;

export interface MaturitySection {
  id: string;
  title: string;
  questions: {id: string; text: string}[];
}

export type MaturityAnswers = Record<string, number | undefined>; // questionId -> 0..4

export interface MaturityResult {
  sectionId: string;
  title: string;
  answered: number;
  total: number;
  /** average of answered questions, 1 decimal; null if none answered */
  score: number | null;
}

export function scoreMaturity(sections: MaturitySection[], answers: MaturityAnswers): MaturityResult[] {
  return sections.map((s) => {
    const values = s.questions
      .map((q) => answers[q.id])
      .filter((v): v is number => typeof v === 'number');
    values.forEach((v) => assertIntInRange(v, 0, 4, 'maturity answer'));
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      sectionId: s.id,
      title: s.title,
      answered: values.length,
      total: s.questions.length,
      score: values.length ? round1(sum / values.length) : null,
    };
  });
}

export function overallMaturity(results: MaturityResult[]): number | null {
  const scored = results.filter((r) => r.score !== null);
  if (!scored.length) return null;
  return round1(scored.reduce((a, r) => a + (r.score as number), 0) / scored.length);
}

/** The lowest-scoring answered sections, used to suggest priorities. */
export function weakestSections(results: MaturityResult[], n = 2): MaturityResult[] {
  return results
    .filter((r) => r.score !== null)
    .sort((a, b) => (a.score as number) - (b.score as number))
    .slice(0, n);
}

/* ------------------------------------------------------------------ */
/* Third-party risk: inherent tier + questionnaire score               */
/* ------------------------------------------------------------------ */

export interface TprmProfile {
  /** 0 none · 1 internal/business · 2 personal data · 3 special-nature or payment data */
  dataSensitivity: 0 | 1 | 2 | 3;
  /** 0 none · 1 user-level access · 2 privileged or network-level access */
  systemAccess: 0 | 1 | 2;
  /** 0 replaceable · 1 important · 2 critical to operations */
  criticality: 0 | 1 | 2;
}

export type TprmTier = 'Tier 1 — Critical' | 'Tier 2 — High' | 'Tier 3 — Moderate' | 'Tier 4 — Low';

/**
 * Inherent tier = highest of the three drivers (a single critical factor is
 * enough to make the supplier critical), escalated one tier when two or more
 * drivers are at their maximum.
 */
export function tprmTier(p: TprmProfile): TprmTier {
  assertIntInRange(p.dataSensitivity, 0, 3, 'dataSensitivity');
  assertIntInRange(p.systemAccess, 0, 2, 'systemAccess');
  assertIntInRange(p.criticality, 0, 2, 'criticality');
  const points = Math.max(p.dataSensitivity, p.systemAccess === 2 ? 3 : p.systemAccess, p.criticality === 2 ? 3 : p.criticality);
  const maxed = [p.dataSensitivity === 3, p.systemAccess === 2, p.criticality === 2].filter(Boolean).length;
  if (points >= 3 || maxed >= 2) return 'Tier 1 — Critical';
  if (points === 2) return 'Tier 2 — High';
  if (points === 1) return 'Tier 3 — Moderate';
  return 'Tier 4 — Low';
}

export type ControlAnswer = 'yes' | 'partial' | 'no' | 'na';
export interface WeightedQuestion {
  id: string;
  text: string;
  weight: 1 | 2 | 3;
}

/**
 * Control score = sum(weight × credit) / sum(weight) over applicable questions,
 * where credit is yes = 1, partial = 0.5, no = 0. "N/A" questions are excluded.
 * Returns a percentage (0–100, 1 decimal) or null if nothing applicable.
 */
export function weightedScore(questions: WeightedQuestion[], answers: Record<string, ControlAnswer | undefined>): number | null {
  const credit: Record<Exclude<ControlAnswer, 'na'>, number> = {yes: 1, partial: 0.5, no: 0};
  let num = 0;
  let den = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (!a || a === 'na') continue;
    num += q.weight * credit[a];
    den += q.weight;
  }
  return den === 0 ? null : round1((num / den) * 100);
}

/** Residual supplier rating combines inherent tier with control score. */
export function supplierRating(tier: TprmTier, controlScore: number | null): 'Acceptable' | 'Acceptable with remediation plan' | 'Escalate — do not onboard without risk acceptance' | 'Incomplete' {
  if (controlScore === null) return 'Incomplete';
  const threshold = tier.startsWith('Tier 1') ? 85 : tier.startsWith('Tier 2') ? 75 : 60;
  if (controlScore >= threshold) return 'Acceptable';
  if (controlScore >= threshold - 20) return 'Acceptable with remediation plan';
  return 'Escalate — do not onboard without risk acceptance';
}

/* ------------------------------------------------------------------ */
/* Incident severity                                                   */
/* ------------------------------------------------------------------ */

export interface IncidentFacts {
  /** 0 none · 1 internal non-sensitive · 2 personal or confidential data · 3 special-nature / large-scale personal data */
  dataImpact: 0 | 1 | 2 | 3;
  /** 0 none · 1 degraded non-critical · 2 critical service degraded · 3 critical service down */
  serviceImpact: 0 | 1 | 2 | 3;
  /** 0 single user/asset · 1 one team · 2 one site/business unit · 3 organisation-wide or external parties */
  scope: 0 | 1 | 2 | 3;
  /** attacker still active, or spreading */
  ongoing: boolean;
  /** privileged / identity-plane compromise (e.g. Global Administrator, domain admin) */
  privilegedCompromise: boolean;
}

export type Severity = 'SEV-1 Critical' | 'SEV-2 High' | 'SEV-3 Medium' | 'SEV-4 Low';

export interface SeverityResult {
  severity: Severity;
  base: number;
  reasons: string[];
  /** Regulatory notification may be required — always confirm with Legal/Privacy */
  privacyReview: boolean;
}

/**
 * base = max(dataImpact, serviceImpact, scope).
 * +1 if ongoing; +1 if privileged compromise (capped at 3).
 * 3 → SEV-1, 2 → SEV-2, 1 → SEV-3, 0 → SEV-4.
 */
export function classifyIncident(f: IncidentFacts): SeverityResult {
  assertIntInRange(f.dataImpact, 0, 3, 'dataImpact');
  assertIntInRange(f.serviceImpact, 0, 3, 'serviceImpact');
  assertIntInRange(f.scope, 0, 3, 'scope');
  const reasons: string[] = [];
  const base = Math.max(f.dataImpact, f.serviceImpact, f.scope);
  reasons.push(`Highest impact factor = ${base}`);
  let level = base;
  if (f.ongoing) {
    level += 1;
    reasons.push('+1: attacker active or incident spreading');
  }
  if (f.privilegedCompromise) {
    level += 1;
    reasons.push('+1: privileged / identity-plane compromise');
  }
  level = Math.min(level, 3);
  const map: Severity[] = ['SEV-4 Low', 'SEV-3 Medium', 'SEV-2 High', 'SEV-1 Critical'];
  return {severity: map[level], base, reasons, privacyReview: f.dataImpact >= 2};
}

/* ------------------------------------------------------------------ */
/* AI system risk tier                                                 */
/* ------------------------------------------------------------------ */

export interface AiFacts {
  prohibitedUse: boolean; // e.g. social scoring, manipulation — organisation policy prohibits
  decisionImpact: 0 | 1 | 2; // 0 advisory · 1 human-in-the-loop decision about people · 2 automated decision about people
  personalData: 0 | 1 | 2; // 0 none · 1 personal · 2 special-nature
  exposure: 0 | 1 | 2; // 0 internal tool · 1 employees broadly · 2 customers/public
  agentic: boolean; // can take actions via tools/APIs
  safetyImpact: boolean; // could affect health, safety or critical infrastructure
}

export type AiTier = 'Prohibited' | 'High' | 'Medium' | 'Low';

/** Points = decisionImpact×2 + personalData + exposure + (agentic?2:0); safety impact or automated decisions with special-nature data → High. */
export function aiRiskTier(f: AiFacts): {tier: AiTier; points: number; reasons: string[]} {
  assertIntInRange(f.decisionImpact, 0, 2, 'decisionImpact');
  assertIntInRange(f.personalData, 0, 2, 'personalData');
  assertIntInRange(f.exposure, 0, 2, 'exposure');
  const reasons: string[] = [];
  if (f.prohibitedUse) return {tier: 'Prohibited', points: 0, reasons: ['Use case is on the prohibited-use list']};
  const points = f.decisionImpact * 2 + f.personalData + f.exposure + (f.agentic ? 2 : 0);
  reasons.push(`Points = ${points} (decision impact ×2, personal data, exposure, agentic +2)`);
  if (f.safetyImpact) {
    reasons.push('Override: safety impact → High');
    return {tier: 'High', points, reasons};
  }
  if (f.decisionImpact === 2 && f.personalData >= 1) {
    reasons.push('Override: automated decisions about people using personal data → High');
    return {tier: 'High', points, reasons};
  }
  if (points >= 6) return {tier: 'High', points, reasons};
  if (points >= 3) return {tier: 'Medium', points, reasons};
  return {tier: 'Low', points, reasons};
}

export const AI_TIER_CONTROLS: Record<AiTier, string[]> = {
  Prohibited: ['Do not proceed. Record the decision in the AI inventory.'],
  High: [
    'AI governance committee approval before pilot',
    'AI impact assessment (ISO/IEC 42005 approach) and DPIA where personal data',
    'Independent testing: bias, robustness, prompt-injection red-team',
    'Human oversight with authority to override; documented appeal route',
    'Monitoring with thresholds; re-assessment at least every 6 months',
  ],
  Medium: [
    'Business-owner approval with second-line review',
    'Risk assessment; DPIA if personal data',
    'Pre-release testing incl. prompt injection for LLM apps',
    'User transparency notice; feedback channel',
    'Annual re-assessment',
  ],
  Low: ['Register in AI inventory', 'Acceptable-use rules apply', 'Review on material change'],
};

/* ------------------------------------------------------------------ */
/* KPI / KRI status                                                    */
/* ------------------------------------------------------------------ */

export interface Indicator {
  id: string;
  name: string;
  type: 'KPI' | 'KRI';
  domain: string;
  unit: '%' | 'count' | 'days';
  /** 'higher' = higher values are better */
  direction: 'higher' | 'lower';
  green: number; // threshold for green
  amber: number; // threshold for amber (between green and red)
  description: string;
}

export type Rag = 'Green' | 'Amber' | 'Red';

export function ragStatus(ind: Indicator, value: number): Rag {
  if (!Number.isFinite(value)) throw new RangeError('value must be a finite number');
  if (ind.direction === 'higher') {
    if (value >= ind.green) return 'Green';
    if (value >= ind.amber) return 'Amber';
    return 'Red';
  }
  if (value <= ind.green) return 'Green';
  if (value <= ind.amber) return 'Amber';
  return 'Red';
}

/* ------------------------------------------------------------------ */
/* CSV export (client-side)                                            */
/* ------------------------------------------------------------------ */

/** RFC 4180-style escaping, plus neutralising spreadsheet formula injection. */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
}
