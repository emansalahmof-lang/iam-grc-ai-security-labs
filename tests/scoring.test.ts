import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreMaturity,
  overallMaturity,
  weakestSections,
  tprmTier,
  weightedScore,
  supplierRating,
  classifyIncident,
  aiRiskTier,
  ragStatus,
  csvCell,
  toCsv,
  type Indicator,
} from '../src/lib/scoring.ts';

const sections = [
  {id: 'a', title: 'A', questions: [{id: 'a1', text: ''}, {id: 'a2', text: ''}]},
  {id: 'b', title: 'B', questions: [{id: 'b1', text: ''}]},
  {id: 'c', title: 'C', questions: [{id: 'c1', text: ''}]},
];

test('maturity: averages answered questions only', () => {
  const r = scoreMaturity(sections, {a1: 3, a2: 2, b1: 1});
  assert.deepEqual(r.map((x) => x.score), [2.5, 1, null]);
  assert.equal(r[0].answered, 2);
  assert.equal(overallMaturity(r), 1.8); // (2.5 + 1) / 2 = 1.75 → 1.8
  assert.deepEqual(weakestSections(r, 1).map((x) => x.sectionId), ['b']);
});

test('maturity: rejects out-of-range answers', () => {
  assert.throws(() => scoreMaturity(sections, {a1: 5}), RangeError);
});

test('maturity: nothing answered gives null overall', () => {
  assert.equal(overallMaturity(scoreMaturity(sections, {})), null);
});

test('tprm tier: single critical driver makes Tier 1', () => {
  assert.equal(tprmTier({dataSensitivity: 3, systemAccess: 0, criticality: 0}), 'Tier 1 — Critical');
  assert.equal(tprmTier({dataSensitivity: 0, systemAccess: 2, criticality: 0}), 'Tier 1 — Critical');
  assert.equal(tprmTier({dataSensitivity: 0, systemAccess: 0, criticality: 2}), 'Tier 1 — Critical');
});

test('tprm tier: graded tiers', () => {
  assert.equal(tprmTier({dataSensitivity: 2, systemAccess: 1, criticality: 1}), 'Tier 2 — High');
  assert.equal(tprmTier({dataSensitivity: 1, systemAccess: 0, criticality: 1}), 'Tier 3 — Moderate');
  assert.equal(tprmTier({dataSensitivity: 0, systemAccess: 0, criticality: 0}), 'Tier 4 — Low');
});

test('weighted score: yes/partial/no and N/A exclusion', () => {
  const qs = [
    {id: 'q1', text: '', weight: 3 as const},
    {id: 'q2', text: '', weight: 1 as const},
    {id: 'q3', text: '', weight: 2 as const},
  ];
  // (3*1 + 1*0.5) / (3+1) = 0.875 → 87.5 ; q3 N/A excluded
  assert.equal(weightedScore(qs, {q1: 'yes', q2: 'partial', q3: 'na'}), 87.5);
  assert.equal(weightedScore(qs, {}), null);
  assert.equal(weightedScore(qs, {q1: 'no', q2: 'no', q3: 'no'}), 0);
});

test('supplier rating thresholds depend on tier', () => {
  assert.equal(supplierRating('Tier 1 — Critical', 85), 'Acceptable');
  assert.equal(supplierRating('Tier 1 — Critical', 70), 'Acceptable with remediation plan');
  assert.equal(supplierRating('Tier 1 — Critical', 60), 'Escalate — do not onboard without risk acceptance');
  assert.equal(supplierRating('Tier 4 — Low', 60), 'Acceptable');
  assert.equal(supplierRating('Tier 2 — High', null), 'Incomplete');
});

test('incident severity: base, modifiers and cap', () => {
  const low = classifyIncident({dataImpact: 0, serviceImpact: 0, scope: 0, ongoing: false, privilegedCompromise: false});
  assert.equal(low.severity, 'SEV-4 Low');
  const mid = classifyIncident({dataImpact: 1, serviceImpact: 0, scope: 1, ongoing: false, privilegedCompromise: false});
  assert.equal(mid.severity, 'SEV-3 Medium');
  const escalated = classifyIncident({dataImpact: 1, serviceImpact: 0, scope: 0, ongoing: true, privilegedCompromise: true});
  assert.equal(escalated.severity, 'SEV-1 Critical');
  const capped = classifyIncident({dataImpact: 3, serviceImpact: 3, scope: 3, ongoing: true, privilegedCompromise: true});
  assert.equal(capped.severity, 'SEV-1 Critical');
  assert.equal(capped.privacyReview, true);
  assert.equal(mid.privacyReview, false);
});

test('ai tier: overrides and points', () => {
  const base = {prohibitedUse: false, decisionImpact: 0 as const, personalData: 0 as const, exposure: 0 as const, agentic: false, safetyImpact: false};
  assert.equal(aiRiskTier(base).tier, 'Low');
  assert.equal(aiRiskTier({...base, prohibitedUse: true}).tier, 'Prohibited');
  assert.equal(aiRiskTier({...base, safetyImpact: true}).tier, 'High');
  assert.equal(aiRiskTier({...base, decisionImpact: 2, personalData: 1}).tier, 'High');
  // HR assistant: advisory, personal data, employees broadly → 0 + 1 + 1 = 2 → Low? add agentic → 4 Medium
  assert.equal(aiRiskTier({...base, personalData: 1, exposure: 1}).tier, 'Low');
  assert.equal(aiRiskTier({...base, personalData: 1, exposure: 1, agentic: true}).tier, 'Medium');
  assert.equal(aiRiskTier({...base, decisionImpact: 1, personalData: 2, exposure: 2}).tier, 'High'); // 2+2+2 = 6
});

test('rag status for both directions', () => {
  const higher: Indicator = {id: 'k', name: '', type: 'KPI', domain: '', unit: '%', direction: 'higher', green: 95, amber: 85, description: ''};
  assert.equal(ragStatus(higher, 96), 'Green');
  assert.equal(ragStatus(higher, 95), 'Green');
  assert.equal(ragStatus(higher, 90), 'Amber');
  assert.equal(ragStatus(higher, 50), 'Red');
  const lower: Indicator = {...higher, direction: 'lower', green: 0, amber: 5};
  assert.equal(ragStatus(lower, 0), 'Green');
  assert.equal(ragStatus(lower, 3), 'Amber');
  assert.equal(ragStatus(lower, 6), 'Red');
  assert.throws(() => ragStatus(lower, Number.NaN), RangeError);
});

test('csv: escaping and formula-injection neutralisation', () => {
  assert.equal(csvCell('plain'), 'plain');
  assert.equal(csvCell('a,b'), '"a,b"');
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  assert.equal(csvCell('-5'), "'-5");
  assert.equal(csvCell(null), '');
  assert.equal(toCsv([['h1', 'h2'], [1, 'x']]), 'h1,h2\r\n1,x');
});
