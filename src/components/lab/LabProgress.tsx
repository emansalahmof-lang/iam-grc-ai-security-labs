import React, {useEffect, useState} from 'react';
import styles from './lab.module.css';

/**
 * Step tracker with a progress bar.
 *
 * Privacy: progress is kept only in this browser's localStorage under the key
 * `lab-progress:<labId>`. It never leaves the device, is not shared between
 * browsers or devices, and disappears if site data is cleared. Every storage
 * call is wrapped so the tracker still works when storage is blocked.
 */
function read(key: string, length: number): boolean[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return Array(length).fill(false);
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === length && parsed.every((v) => typeof v === 'boolean')) {
      return parsed as boolean[];
    }
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return Array(length).fill(false);
}

function write(key: string, value: boolean[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore: progress simply won't persist */
  }
}

export default function LabProgress({labId, steps}: {labId: string; steps: string[]}): React.JSX.Element {
  const key = `lab-progress:${labId}`;
  const [done, setDone] = useState<boolean[]>(() => Array(steps.length).fill(false));

  // Load after mount so server-rendered HTML and first client render match.
  useEffect(() => {
    setDone(read(key, steps.length));
  }, [key, steps.length]);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      write(key, next);
      return next;
    });
  };

  const count = done.filter(Boolean).length;
  const pct = Math.round((count / steps.length) * 100);

  return (
    <section className={styles.progress} aria-label={`${labId} progress`}>
      <div className={styles.progressHeader}>
        <strong>Your progress</strong>
        <span>
          {count} of {steps.length} steps · {pct}%
        </span>
      </div>
      <div
        className={styles.progressBar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Lab completion">
        <span style={{width: `${pct}%`}} />
      </div>
      <ul className={styles.progressList}>
        {steps.map((s, i) => (
          <li key={s}>
            <label>
              <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
              <span className={done[i] ? styles.progressDone : undefined}>{s}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className={styles.progressFooter}>
        <small>Saved only in this browser. Nothing is sent to a server.</small>
        {count > 0 && (
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => {
              const cleared = Array(steps.length).fill(false);
              write(key, cleared);
              setDone(cleared);
            }}>
            Reset
          </button>
        )}
      </div>
    </section>
  );
}
