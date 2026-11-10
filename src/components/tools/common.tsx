import React, {useEffect, useRef, useState} from 'react';
import {toCsv} from '@site/src/lib/scoring';
import styles from './tools.module.css';

/** Download rows as a UTF-8 CSV (BOM added so Excel detects encoding). Client-side only. */
export function downloadCsv(filename: string, rows: unknown[][]): void {
  const blob = new Blob(['﻿' + toCsv(rows)], {type: 'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * State persisted in this browser's localStorage only.
 * - Loads after mount (so server HTML and first client render match).
 * - Every storage call is wrapped; the tool works when storage is blocked.
 * - `validate` rejects tampered or outdated stored values.
 */
export function useLocalState<T>(key: string, initial: T, validate: (v: unknown) => v is T): [T, (v: T | ((p: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) setValue(parsed);
      }
    } catch {
      /* ignore */
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  const reset = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initial);
  };

  return [value, setValue, reset];
}

export function isStringRecord(v: unknown): v is Record<string, string> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'string');
}

export function isNumberRecord(v: unknown): v is Record<string, number> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'number' && Number.isFinite(x));
}

export function PrivacyNote({stored}: {stored: boolean}): React.JSX.Element {
  return (
    <p className={styles.privacy}>
      {stored
        ? 'Your answers are saved only in this browser (localStorage) so you can return later. Nothing is sent to a server. Clear them with Reset, or by clearing site data. Do not enter confidential or personal information on shared computers.'
        : 'Runs entirely in your browser. Nothing is stored or sent anywhere.'}
    </p>
  );
}

export function ToolFrame({title, children}: {title: string; children: React.ReactNode}): React.JSX.Element {
  return (
    <section className={styles.tool} aria-label={title}>
      {children}
    </section>
  );
}

export function Bar({value, max, label}: {value: number; max: number; label: string}): React.JSX.Element {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={styles.bar} role="img" aria-label={label}>
      <span style={{width: `${pct}%`}} />
    </div>
  );
}
