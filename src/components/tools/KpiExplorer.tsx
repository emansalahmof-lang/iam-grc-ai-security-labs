import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import {ragStatus, type Indicator, type Rag} from '@site/src/lib/scoring';
import {PrivacyNote, ToolFrame} from './common';
import styles from './tools.module.css';

export const INDICATORS: Indicator[] = [
  {id: 'iam1', name: 'Leavers disabled within 1 working day', type: 'KPI', domain: 'Identity', unit: '%', direction: 'higher', green: 98, amber: 90, description: 'Leaver control effectiveness (HR termination date vs account disable).'},
  {id: 'iam2', name: 'Privileged accounts without phishing-resistant MFA', type: 'KRI', domain: 'Identity', unit: 'count', direction: 'lower', green: 0, amber: 0, description: 'Any value above zero is red.'},
  {id: 'iam3', name: 'Orphaned accounts', type: 'KRI', domain: 'Identity', unit: 'count', direction: 'lower', green: 0, amber: 5, description: 'Accounts without a valid owner identity.'},
  {id: 'iam4', name: 'Access review completion', type: 'KPI', domain: 'Identity', unit: '%', direction: 'higher', green: 100, amber: 95, description: 'Reviews completed by the due date.'},
  {id: 'vul1', name: 'Critical patches applied within 14 days', type: 'KPI', domain: 'Vulnerability', unit: '%', direction: 'higher', green: 95, amber: 85, description: 'Patch SLA compliance for critical severity.'},
  {id: 'vul2', name: 'Critical vulnerabilities open > 30 days', type: 'KRI', domain: 'Vulnerability', unit: 'count', direction: 'lower', green: 5, amber: 10, description: 'Ageing exposure on internet-facing and critical assets.'},
  {id: 'res1', name: 'Critical systems with successful restore test this quarter', type: 'KPI', domain: 'Resilience', unit: '%', direction: 'higher', green: 100, amber: 90, description: 'Backups proven restorable, not just completed.'},
  {id: 'tpr1', name: 'Tier 1 suppliers without a current assessment', type: 'KRI', domain: 'Third party', unit: 'count', direction: 'lower', green: 0, amber: 0, description: 'Critical suppliers not assessed within the cycle.'},
  {id: 'gov1', name: 'High-rated audit actions overdue', type: 'KRI', domain: 'Governance', unit: 'count', direction: 'lower', green: 0, amber: 2, description: 'Overdue remediation of high findings.'},
  {id: 'gov2', name: 'Staff security awareness completion', type: 'KPI', domain: 'Governance', unit: '%', direction: 'higher', green: 95, amber: 85, description: 'Annual training completion.'},
  {id: 'inc1', name: 'Mean time to contain SEV-1/SEV-2 incidents', type: 'KPI', domain: 'Incident response', unit: 'days', direction: 'lower', green: 1, amber: 3, description: 'Detection to containment.'},
  {id: 'ai1', name: 'AI systems in production without completed assessment', type: 'KRI', domain: 'AI governance', unit: 'count', direction: 'lower', green: 0, amber: 0, description: 'From the AI system inventory.'},
];

const ragClass: Record<Rag, string> = {Green: styles.green, Amber: styles.amber, Red: styles.red};

function fmt(ind: Indicator, v: number) {
  return ind.unit === '%' ? `${v}%` : ind.unit === 'days' ? `${v} d` : String(v);
}

export default function KpiExplorer(): React.JSX.Element {
  const [domain, setDomain] = useState('All');
  const [type, setType] = useState<'All' | 'KPI' | 'KRI'>('All');
  const [q, setQ] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  const domains = ['All', ...Array.from(new Set(INDICATORS.map((i) => i.domain)))];
  const list = useMemo(
    () =>
      INDICATORS.filter(
        (i) =>
          (domain === 'All' || i.domain === domain) &&
          (type === 'All' || i.type === type) &&
          (q.trim() === '' || `${i.name} ${i.description}`.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [domain, type, q],
  );

  return (
    <ToolFrame title="KPI and KRI explorer">
      <PrivacyNote stored={false} />
      <div className={styles.inlineRow}>
        <label className={styles.inline} htmlFor="kpi-domain">
          <span>Domain</span>
          <select id="kpi-domain" value={domain} onChange={(e) => setDomain(e.target.value)}>
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className={styles.inline} htmlFor="kpi-type">
          <span>Type</span>
          <select id="kpi-type" value={type} onChange={(e) => setType(e.target.value as 'All' | 'KPI' | 'KRI')}>
            <option>All</option>
            <option>KPI</option>
            <option>KRI</option>
          </select>
        </label>
        <label className={styles.inline} htmlFor="kpi-q">
          <span>Search</span>
          <input id="kpi-q" type="search" value={q} maxLength={60} onChange={(e) => setQ(e.target.value)} placeholder="e.g. MFA" />
        </label>
      </div>
      <p className={styles.hint} role="status">
        Showing {list.length} of {INDICATORS.length} indicators. Enter an actual value to see its status.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Indicator</th>
              <th scope="col">Type</th>
              <th scope="col">Green / Amber thresholds</th>
              <th scope="col">Actual</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((ind) => {
              const raw = values[ind.id] ?? '';
              const num = raw.trim() === '' ? null : Number(raw);
              const valid = num !== null && Number.isFinite(num) && num >= 0 && (ind.unit !== '%' || num <= 100);
              const rag = valid ? ragStatus(ind, num as number) : null;
              const sign = ind.direction === 'higher' ? '≥' : '≤';
              return (
                <tr key={ind.id}>
                  <th scope="row">
                    {ind.name}
                    <span className={styles.hint}>
                      {ind.domain} · {ind.description}
                    </span>
                  </th>
                  <td>{ind.type}</td>
                  <td>
                    Green {sign} {fmt(ind, ind.green)}
                    <br />
                    Amber {sign} {fmt(ind, ind.amber)}
                  </td>
                  <td>
                    <input
                      aria-label={`Actual value for ${ind.name}`}
                      className={styles.num}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={ind.unit === '%' ? 100 : undefined}
                      value={raw}
                      onChange={(e) => setValues((p) => ({...p, [ind.id]: e.target.value}))}
                    />
                  </td>
                  <td>
                    {rag ? (
                      <span className={clsx(styles.pill, ragClass[rag])}>{rag}</span>
                    ) : raw !== '' ? (
                      <span className={styles.hint}>Invalid</span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={styles.method}>
        Method: for &quot;higher is better&quot; indicators, Green when actual ≥ green threshold, Amber when ≥ amber threshold, otherwise Red. For
        &quot;lower is better&quot;, the comparisons are reversed (≤). Thresholds are illustrative — set yours in your risk appetite statement.
      </p>
    </ToolFrame>
  );
}
