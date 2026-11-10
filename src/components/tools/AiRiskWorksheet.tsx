import React, {useState} from 'react';
import clsx from 'clsx';
import {aiRiskTier, AI_TIER_CONTROLS, type AiFacts} from '@site/src/lib/scoring';
import {downloadCsv, PrivacyNote, ToolFrame} from './common';
import styles from './tools.module.css';

const DECISION = ['Advisory only — no decision about people', 'Supports a human decision about people', 'Makes automated decisions about people'];
const PERSONAL = ['No personal data', 'Personal data', 'Special-nature personal data (health, children, religion, etc.)'];
const EXPOSURE = ['Small internal team', 'Employees broadly', 'Customers or the public'];

export default function AiRiskWorksheet(): React.JSX.Element {
  const [name, setName] = useState('HR policy assistant (simulated)');
  const [f, setF] = useState<AiFacts>({prohibitedUse: false, decisionImpact: 0, personalData: 1, exposure: 1, agentic: false, safetyImpact: false});
  const r = aiRiskTier(f);

  const select = (label: string, opts: string[], key: 'decisionImpact' | 'personalData' | 'exposure') => (
    <label className={styles.inline} htmlFor={`ai-${key}`}>
      <span>{label}</span>
      <select id={`ai-${key}`} value={f[key]} onChange={(e) => setF({...f, [key]: Number(e.target.value)} as AiFacts)}>
        {opts.map((o, i) => (
          <option key={o} value={i}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  const exportCsv = () =>
    downloadCsv('ai-risk-worksheet.csv', [
      ['AI system', name],
      ['Decision impact', DECISION[f.decisionImpact]],
      ['Personal data', PERSONAL[f.personalData]],
      ['Exposure', EXPOSURE[f.exposure]],
      ['Agentic (takes actions)', f.agentic ? 'Yes' : 'No'],
      ['Safety impact', f.safetyImpact ? 'Yes' : 'No'],
      ['Prohibited use', f.prohibitedUse ? 'Yes' : 'No'],
      ['Tier', r.tier],
      ['Rationale', r.reasons.join(' | ')],
      [],
      ['Minimum controls for this tier'],
      ...AI_TIER_CONTROLS[r.tier].map((c) => [c]),
    ]);

  return (
    <ToolFrame title="AI risk assessment worksheet">
      <PrivacyNote stored={false} />
      <label className={styles.inline} htmlFor="ai-name">
        <span>AI system name</span>
        <input id="ai-name" type="text" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className={styles.inlineRow}>
        {select('Decision impact', DECISION, 'decisionImpact')}
        {select('Personal data', PERSONAL, 'personalData')}
        {select('Who uses or is affected', EXPOSURE, 'exposure')}
      </div>
      <div className={styles.checks}>
        <label>
          <input type="checkbox" checked={f.agentic} onChange={(e) => setF({...f, agentic: e.target.checked})} /> Can take actions through tools
          or APIs (agentic)
        </label>
        <label>
          <input type="checkbox" checked={f.safetyImpact} onChange={(e) => setF({...f, safetyImpact: e.target.checked})} /> Could affect
          health, safety or critical infrastructure
        </label>
        <label>
          <input type="checkbox" checked={f.prohibitedUse} onChange={(e) => setF({...f, prohibitedUse: e.target.checked})} /> Use case is
          on the organisation&apos;s prohibited list
        </label>
      </div>
      <div className={styles.results} role="status" aria-live="polite">
        <p
          className={clsx(
            styles.pill,
            styles.big,
            r.tier === 'Prohibited' || r.tier === 'High' ? styles.red : r.tier === 'Medium' ? styles.amber : styles.green,
          )}>
          Risk tier: {r.tier}
        </p>
        <ul className={styles.reasons}>
          {r.reasons.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h5 className={styles.subhead}>Minimum governance for this tier</h5>
        <ul>
          {AI_TIER_CONTROLS[r.tier].map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className={styles.method}>
          Method: points = decision impact × 2 + personal data + exposure + 2 if agentic. 0–2 Low, 3–5 Medium, 6+ High. Overrides: any safety
          impact, or automated decisions about people using personal data, is High; a prohibited use stops the assessment. This is an
          illustrative triage — it does not replace an ISO/IEC 42005-style impact assessment or a DPIA.
        </p>
        <div className={styles.actions}>
          <button type="button" className="button button--primary button--sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>
    </ToolFrame>
  );
}
