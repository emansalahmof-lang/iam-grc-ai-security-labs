import React from 'react';
import {
  MATURITY_LEVELS,
  scoreMaturity,
  overallMaturity,
  weakestSections,
  type MaturitySection,
} from '@site/src/lib/scoring';
import {useLocalState, isNumberRecord, downloadCsv, PrivacyNote, ToolFrame, Bar} from './common';
import styles from './tools.module.css';

export default function MaturityAssessment({
  storageKey,
  sections,
  exportName,
}: {
  storageKey: string;
  sections: MaturitySection[];
  exportName: string;
}): React.JSX.Element {
  const [answers, setAnswers, reset] = useLocalState<Record<string, number>>(
    `tool:${storageKey}`,
    {},
    (v): v is Record<string, number> => isNumberRecord(v) && Object.values(v).every((x) => Number.isInteger(x) && x >= 0 && x <= 4),
  );

  const results = scoreMaturity(sections, answers);
  const overall = overallMaturity(results);
  const weakest = weakestSections(results, 2);
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);

  const exportCsv = () => {
    const rows: unknown[][] = [['Section', 'Question', 'Level (0-4)', 'Level label']];
    sections.forEach((s) =>
      s.questions.forEach((q) => {
        const v = answers[q.id];
        rows.push([s.title, q.text, v ?? '', v === undefined ? 'Not answered' : MATURITY_LEVELS[v]]);
      }),
    );
    rows.push([]);
    rows.push(['Section', 'Score (avg 0-4)', 'Answered', 'Total']);
    results.forEach((r) => rows.push([r.title, r.score ?? '', r.answered, r.total]));
    rows.push(['Overall', overall ?? '']);
    downloadCsv(exportName, rows);
  };

  return (
    <ToolFrame title="Maturity assessment">
      <PrivacyNote stored />
      {sections.map((s) => (
        <fieldset key={s.id} className={styles.group}>
          <legend>{s.title}</legend>
          {s.questions.map((q) => (
            <div key={q.id} className={styles.row}>
              <label htmlFor={`m-${q.id}`} className={styles.rowLabel}>
                {q.text}
              </label>
              <select
                id={`m-${q.id}`}
                value={answers[q.id] ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAnswers((prev) => {
                    const next = {...prev};
                    if (val === '') delete next[q.id];
                    else next[q.id] = Number(val);
                    return next;
                  });
                }}>
                <option value="">— select —</option>
                {MATURITY_LEVELS.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </fieldset>
      ))}

      <div className={styles.results} role="status" aria-live="polite">
        <h4>
          Results — {answeredCount} of {totalQuestions} answered
        </h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              <th scope="col">Score (0–4)</th>
              <th scope="col" className={styles.barCol}>
                Level
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.sectionId}>
                <th scope="row">{r.title}</th>
                <td>{r.score === null ? '—' : r.score.toFixed(1)}</td>
                <td>{r.score !== null && <Bar value={r.score} max={4} label={`${r.title}: ${r.score} of 4`} />}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Overall</th>
              <td>{overall === null ? '—' : overall.toFixed(1)}</td>
              <td>{overall !== null && <Bar value={overall} max={4} label={`Overall: ${overall} of 4`} />}</td>
            </tr>
          </tfoot>
        </table>
        {weakest.length > 0 && (
          <p>
            <strong>Suggested focus:</strong> {weakest.map((w) => `${w.title} (${w.score?.toFixed(1)})`).join(', ')} — the
            lowest-scoring domains you have answered.
          </p>
        )}
        <p className={styles.method}>
          Method: each answer is a level from 0 to 4; a domain score is the average of its answered questions; overall is the
          average of domain scores. Unanswered questions are excluded, not counted as zero.
        </p>
        <div className={styles.actions}>
          <button type="button" className="button button--primary button--sm" onClick={exportCsv} disabled={answeredCount === 0}>
            Export CSV
          </button>
          <button type="button" className="button button--secondary button--outline button--sm" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </ToolFrame>
  );
}
