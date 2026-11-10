import React, {useState} from 'react';
import clsx from 'clsx';
import {
  tprmTier,
  weightedScore,
  supplierRating,
  type ControlAnswer,
  type TprmProfile,
  type WeightedQuestion,
} from '@site/src/lib/scoring';
import {downloadCsv, PrivacyNote, ToolFrame, Bar} from './common';
import styles from './tools.module.css';

export const TPRM_QUESTIONS: {domain: string; questions: WeightedQuestion[]}[] = [
  {
    domain: 'Governance',
    questions: [
      {id: 'g1', text: 'Has an information security policy approved by management and reviewed in the last 12 months', weight: 2},
      {id: 'g2', text: 'Holds a current certification (e.g. ISO/IEC 27001) whose scope covers the service provided', weight: 2},
      {id: 'g3', text: 'Has a named security contact and agrees to notify security incidents within a contractual timeframe', weight: 3},
    ],
  },
  {
    domain: 'Identity & access',
    questions: [
      {id: 'a1', text: 'Enforces MFA for all staff access to systems holding our data', weight: 3},
      {id: 'a2', text: 'Reviews privileged access at least quarterly and removes leavers promptly', weight: 2},
    ],
  },
  {
    domain: 'Data protection',
    questions: [
      {id: 'd1', text: 'Encrypts our data in transit and at rest', weight: 3},
      {id: 'd2', text: 'Discloses data storage locations and sub-processors, and notifies changes', weight: 2},
      {id: 'd3', text: 'Returns or securely deletes our data at contract end, with confirmation', weight: 2},
    ],
  },
  {
    domain: 'Operations & resilience',
    questions: [
      {id: 'o1', text: 'Patches critical vulnerabilities within a defined timeframe', weight: 2},
      {id: 'o2', text: 'Tests backups and business continuity plans at least annually', weight: 2},
      {id: 'o3', text: 'Performs independent penetration testing at least annually', weight: 1},
    ],
  },
];

const ANSWERS: {value: ControlAnswer; label: string}[] = [
  {value: 'yes', label: 'Yes'},
  {value: 'partial', label: 'Partial'},
  {value: 'no', label: 'No'},
  {value: 'na', label: 'N/A'},
];

const DATA_OPTS = ['None', 'Internal business data', 'Personal data', 'Special-nature personal data or payment data'];
const ACCESS_OPTS = ['No access to our systems', 'User-level access', 'Privileged or network-level access'];
const CRIT_OPTS = ['Easily replaceable', 'Important', 'Critical to operations'];

export default function TprmQuestionnaire(): React.JSX.Element {
  const [supplier, setSupplier] = useState('Example Payroll Co (fictional)');
  const [profile, setProfile] = useState<TprmProfile>({dataSensitivity: 2, systemAccess: 1, criticality: 1});
  const [answers, setAnswers] = useState<Record<string, ControlAnswer>>({});

  const all = TPRM_QUESTIONS.flatMap((d) => d.questions);
  const tier = tprmTier(profile);
  const score = weightedScore(all, answers);
  const rating = supplierRating(tier, score);
  const answered = Object.keys(answers).length;

  const exportCsv = () => {
    const rows: unknown[][] = [
      ['Supplier', supplier],
      ['Data sensitivity', DATA_OPTS[profile.dataSensitivity]],
      ['System access', ACCESS_OPTS[profile.systemAccess]],
      ['Criticality', CRIT_OPTS[profile.criticality]],
      ['Inherent tier', tier],
      ['Control score %', score ?? ''],
      ['Rating', rating],
      [],
      ['Domain', 'Question', 'Weight', 'Answer'],
    ];
    TPRM_QUESTIONS.forEach((d) => d.questions.forEach((q) => rows.push([d.domain, q.text, q.weight, answers[q.id] ?? ''])));
    downloadCsv('third-party-assessment.csv', rows);
  };

  const sel = (label: string, opts: string[], value: number, onChange: (v: number) => void, id: string) => (
    <label className={styles.inline} htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {opts.map((o, i) => (
          <option key={o} value={i}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <ToolFrame title="Third-party risk questionnaire">
      <PrivacyNote stored={false} />
      <fieldset className={styles.group}>
        <legend>1 · Inherent risk profile</legend>
        <label className={styles.inline} htmlFor="tp-name">
          <span>Supplier name</span>
          <input id="tp-name" type="text" maxLength={80} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        </label>
        <div className={styles.inlineRow}>
          {sel('Data handled', DATA_OPTS, profile.dataSensitivity, (v) => setProfile({...profile, dataSensitivity: v as TprmProfile['dataSensitivity']}), 'tp-data')}
          {sel('Access to our systems', ACCESS_OPTS, profile.systemAccess, (v) => setProfile({...profile, systemAccess: v as TprmProfile['systemAccess']}), 'tp-access')}
          {sel('Business criticality', CRIT_OPTS, profile.criticality, (v) => setProfile({...profile, criticality: v as TprmProfile['criticality']}), 'tp-crit')}
        </div>
        <p className={clsx(styles.pill, tier.startsWith('Tier 1') ? styles.red : tier.startsWith('Tier 2') ? styles.amber : styles.green)}>
          Inherent tier: <strong>{tier}</strong>
        </p>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>2 · Control questionnaire</legend>
        {TPRM_QUESTIONS.map((d) => (
          <div key={d.domain}>
            <h5 className={styles.subhead}>{d.domain}</h5>
            {d.questions.map((q) => (
              <div key={q.id} className={styles.row}>
                <span className={styles.rowLabel} id={`tq-${q.id}`}>
                  {q.text} <span className={styles.hint}>weight {q.weight}</span>
                </span>
                <div role="radiogroup" aria-labelledby={`tq-${q.id}`} className={styles.segmented}>
                  {ANSWERS.map((a) => (
                    <label key={a.value} className={clsx(answers[q.id] === a.value && styles.segOn)}>
                      <input
                        type="radio"
                        name={`tq-${q.id}`}
                        value={a.value}
                        checked={answers[q.id] === a.value}
                        onChange={() => setAnswers((prev) => ({...prev, [q.id]: a.value}))}
                      />
                      {a.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </fieldset>

      <div className={styles.results} role="status" aria-live="polite">
        <h4>3 · Result</h4>
        <p>
          Answered {answered} of {all.length}. Control score: <strong>{score === null ? '—' : `${score}%`}</strong>
        </p>
        {score !== null && <Bar value={score} max={100} label={`Control score ${score}%`} />}
        <p
          className={clsx(
            styles.pill,
            rating === 'Acceptable' ? styles.green : rating.startsWith('Acceptable with') ? styles.amber : rating === 'Incomplete' ? undefined : styles.red,
          )}>
          Rating: <strong>{rating}</strong>
        </p>
        <details className={styles.method}>
          <summary>How this is calculated</summary>
          <ul>
            <li>
              <strong>Inherent tier</strong> — the highest of the three drivers; privileged access and critical-to-operations count as
              top level; two or more drivers at maximum also make Tier 1.
            </li>
            <li>
              <strong>Control score</strong> = Σ(weight × credit) ÷ Σ(weight) over applicable questions, where Yes = 1, Partial = 0.5,
              No = 0, and N/A is excluded.
            </li>
            <li>
              <strong>Rating</strong> — pass mark by tier: Tier 1 ≥ 85%, Tier 2 ≥ 75%, Tiers 3–4 ≥ 60%. Up to 20 points below the pass
              mark = acceptable with a remediation plan; lower = escalate for risk acceptance.
            </li>
            <li>These thresholds are examples. Replace them with your organisation&apos;s approved TPRM criteria.</li>
          </ul>
        </details>
        <div className={styles.actions}>
          <button type="button" className="button button--primary button--sm" onClick={exportCsv}>
            Export CSV
          </button>
          <button type="button" className="button button--secondary button--outline button--sm" onClick={() => setAnswers({})}>
            Clear answers
          </button>
        </div>
      </div>
    </ToolFrame>
  );
}
