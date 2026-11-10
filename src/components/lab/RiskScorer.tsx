import React, {useState} from 'react';
import clsx from 'clsx';
import styles from './lab.module.css';

/**
 * 5 x 5 likelihood x impact scorer used in LAB-007.
 *
 * Method (documented on the page so results are reproducible):
 *   score = likelihood x impact            (range 1-25)
 *   Low 1-4 · Medium 5-9 · High 10-16 · Critical 20-25
 * These bands are an EXAMPLE risk criterion. ISO/IEC 27001 clause 6.1.2 requires
 * each organisation to define its own criteria; replace them with yours.
 */
export const LIKELIHOOD = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'];
export const IMPACT = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe'];

export type Level = 'Low' | 'Medium' | 'High' | 'Critical';

export function riskLevel(score: number): Level {
  if (!Number.isInteger(score) || score < 1 || score > 25) {
    throw new RangeError('score must be an integer from 1 to 25');
  }
  if (score >= 20) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

const levelClass: Record<Level, string> = {
  Low: styles.riskLow,
  Medium: styles.riskMedium,
  High: styles.riskHigh,
  Critical: styles.riskCritical,
};

function Picker({
  label,
  names,
  value,
  onChange,
}: {
  label: string;
  names: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className={styles.riskPicker}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {names.map((n, i) => (
          <option key={n} value={i + 1}>
            {i + 1} — {n}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function RiskScorer(): React.JSX.Element {
  const [l, setL] = useState(3);
  const [i, setI] = useState(4);
  const score = l * i;
  const level = riskLevel(score);

  return (
    <section className={styles.risk} aria-label="Risk scoring exercise">
      <div className={styles.riskControls}>
        <Picker label="Likelihood" names={LIKELIHOOD} value={l} onChange={setL} />
        <Picker label="Impact" names={IMPACT} value={i} onChange={setI} />
        <div className={clsx(styles.riskResult, levelClass[level])} role="status" aria-live="polite">
          <span className={styles.riskScore}>{score}</span>
          <span>{level}</span>
        </div>
      </div>

      <div className={styles.riskScroll} tabIndex={0} role="region" aria-label="Risk matrix (scrollable)">
      <table className={styles.riskMatrix}>
        <caption>
          Likelihood × impact. Your selection is outlined. Calculation: {l} × {i} = {score}.
        </caption>
        <thead>
          <tr>
            <th scope="col">Likelihood ↓ / Impact →</th>
            {IMPACT.map((n, idx) => (
              <th scope="col" key={n}>
                {idx + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[5, 4, 3, 2, 1].map((row) => (
            <tr key={row}>
              <th scope="row">
                {row} {LIKELIHOOD[row - 1]}
              </th>
              {[1, 2, 3, 4, 5].map((col) => {
                const s = row * col;
                const lv = riskLevel(s);
                return (
                  <td
                    key={col}
                    className={clsx(levelClass[lv], row === l && col === i && styles.riskSelected)}
                    title={`${lv}: ${row} × ${col} = ${s}`}>
                    {s}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className={styles.riskNote}>
        Bands: Low 1–4 · Medium 5–9 · High 10–16 · Critical 20–25. These are illustrative criteria —
        define your own risk acceptance criteria before using a matrix like this.
      </p>
    </section>
  );
}
