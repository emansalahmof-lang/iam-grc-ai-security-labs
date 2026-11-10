import React, {useState} from 'react';
import clsx from 'clsx';
import {classifyIncident, type IncidentFacts} from '@site/src/lib/scoring';
import {PrivacyNote, ToolFrame} from './common';
import styles from './tools.module.css';

const DATA = ['No data affected', 'Internal, non-sensitive data', 'Personal or confidential data', 'Special-nature or large-scale personal data'];
const SERVICE = ['No service impact', 'Non-critical service degraded', 'Critical service degraded', 'Critical service unavailable'];
const SCOPE = ['Single user or asset', 'One team', 'One site or business unit', 'Organisation-wide or external parties'];

const RESPONSE: Record<string, string[]> = {
  'SEV-1 Critical': [
    'Activate incident response team and crisis management immediately',
    'Notify CISO and executive sponsor within 30 minutes',
    'Engage Legal / Privacy to assess regulatory notification deadlines',
    'Preserve evidence; consider external IR support',
  ],
  'SEV-2 High': ['Incident manager assigned within 1 hour', 'Notify CISO within 2 hours', 'Containment plan agreed and tracked'],
  'SEV-3 Medium': ['Handled by security operations within the business day', 'Report in weekly security summary'],
  'SEV-4 Low': ['Ticket and resolve through normal operations', 'Track for trends'],
};

export default function IncidentClassifier(): React.JSX.Element {
  const [f, setF] = useState<IncidentFacts>({dataImpact: 0, serviceImpact: 1, scope: 1, ongoing: false, privilegedCompromise: false});
  const r = classifyIncident(f);

  const select = (label: string, opts: string[], key: 'dataImpact' | 'serviceImpact' | 'scope') => (
    <label className={styles.inline} htmlFor={`inc-${key}`}>
      <span>{label}</span>
      <select id={`inc-${key}`} value={f[key]} onChange={(e) => setF({...f, [key]: Number(e.target.value)} as IncidentFacts)}>
        {opts.map((o, i) => (
          <option key={o} value={i}>
            {i} — {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <ToolFrame title="Incident severity classification">
      <PrivacyNote stored={false} />
      <div className={styles.inlineRow}>
        {select('Data impact', DATA, 'dataImpact')}
        {select('Service impact', SERVICE, 'serviceImpact')}
        {select('Scope', SCOPE, 'scope')}
      </div>
      <div className={styles.checks}>
        <label>
          <input type="checkbox" checked={f.ongoing} onChange={(e) => setF({...f, ongoing: e.target.checked})} /> Attacker still active or
          incident spreading
        </label>
        <label>
          <input type="checkbox" checked={f.privilegedCompromise} onChange={(e) => setF({...f, privilegedCompromise: e.target.checked})} />{' '}
          Privileged or identity-plane account compromised
        </label>
      </div>
      <div className={styles.results} role="status" aria-live="polite">
        <p
          className={clsx(
            styles.pill,
            styles.big,
            r.severity.startsWith('SEV-1') ? styles.red : r.severity.startsWith('SEV-2') ? styles.amber : styles.green,
          )}>
          {r.severity}
        </p>
        <ul className={styles.reasons}>
          {r.reasons.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {r.privacyReview && (
          <p className={clsx(styles.pill, styles.amber)}>
            Personal data involved — involve Privacy/Legal now. Notification deadlines may apply (e.g. Qatar PDPPL guidelines, GDPR 72 hours).
          </p>
        )}
        <h5 className={styles.subhead}>Example response expectations</h5>
        <ul>
          {RESPONSE[r.severity].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className={styles.method}>
          Method: severity starts from the highest of data impact, service impact and scope (0–3). Add one level if the incident is ongoing
          and one if a privileged identity is compromised, capped at SEV-1. Response times are illustrative — use your approved incident
          response plan.
        </p>
      </div>
    </ToolFrame>
  );
}
