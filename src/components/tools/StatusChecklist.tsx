import React from 'react';
import {useLocalState, isStringRecord, downloadCsv, PrivacyNote, ToolFrame, Bar} from './common';
import styles from './tools.module.css';

export interface ChecklistGroup {
  id: string;
  title: string;
  items: {id: string; text: string; evidence?: string}[];
}

const STATUSES = ['Not started', 'In progress', 'Done', 'N/A'] as const;
type Status = (typeof STATUSES)[number];

const isStatusRecord = (v: unknown): v is Record<string, Status> =>
  isStringRecord(v) && Object.values(v).every((s) => (STATUSES as readonly string[]).includes(s));

/** Progress = Done / (all items − N/A). */
export function groupProgress(items: {id: string}[], status: Record<string, Status>): {done: number; applicable: number} {
  const applicable = items.filter((i) => status[i.id] !== 'N/A').length;
  const done = items.filter((i) => status[i.id] === 'Done').length;
  return {done, applicable};
}

export default function StatusChecklist({
  storageKey,
  groups,
  exportName,
}: {
  storageKey: string;
  groups: ChecklistGroup[];
  exportName: string;
}): React.JSX.Element {
  const [status, setStatus, reset] = useLocalState<Record<string, Status>>(`tool:${storageKey}`, {}, isStatusRecord);

  const all = groups.flatMap((g) => g.items);
  const total = groupProgress(all, status);

  const exportCsv = () => {
    const rows: unknown[][] = [['Area', 'Requirement / item', 'Typical evidence', 'Status']];
    groups.forEach((g) => g.items.forEach((i) => rows.push([g.title, i.text, i.evidence ?? '', status[i.id] ?? 'Not started'])));
    downloadCsv(exportName, rows);
  };

  return (
    <ToolFrame title="Checklist">
      <PrivacyNote stored />
      <div className={styles.summary} role="status" aria-live="polite">
        <strong>
          Overall: {total.done} of {total.applicable} applicable items done
          {total.applicable ? ` (${Math.round((total.done / total.applicable) * 100)}%)` : ''}
        </strong>
        <Bar value={total.done} max={Math.max(total.applicable, 1)} label="Overall completion" />
      </div>
      {groups.map((g) => {
        const p = groupProgress(g.items, status);
        return (
          <details key={g.id} className={styles.group} open>
            <summary>
              <span>{g.title}</span>
              <span className={styles.groupCount}>
                {p.done}/{p.applicable}
              </span>
            </summary>
            {g.items.map((i) => (
              <div key={i.id} className={styles.row}>
                <label htmlFor={`c-${i.id}`} className={styles.rowLabel}>
                  {i.text}
                  {i.evidence && <span className={styles.hint}>Evidence: {i.evidence}</span>}
                </label>
                <select
                  id={`c-${i.id}`}
                  value={status[i.id] ?? 'Not started'}
                  data-status={status[i.id] ?? 'Not started'}
                  onChange={(e) => setStatus((prev) => ({...prev, [i.id]: e.target.value as Status}))}>
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </details>
        );
      })}
      <div className={styles.actions}>
        <button type="button" className="button button--primary button--sm" onClick={exportCsv}>
          Export CSV
        </button>
        <button type="button" className="button button--secondary button--outline button--sm" onClick={reset}>
          Reset
        </button>
      </div>
    </ToolFrame>
  );
}
