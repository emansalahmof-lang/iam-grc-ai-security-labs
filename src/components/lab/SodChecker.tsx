import React, {useState} from 'react';
import clsx from 'clsx';
import styles from './lab.module.css';

/**
 * Segregation-of-duties checker for a fictional procure-to-pay process.
 * Rules are listed on screen so the logic is fully transparent.
 */
export interface Entitlement {
  id: string;
  label: string;
}
export interface SodRule {
  id: string;
  a: string;
  b: string;
  risk: string;
  mitigation: string;
}

export const ENTITLEMENTS: Entitlement[] = [
  {id: 'VENDOR_CREATE', label: 'Create / edit vendor master data'},
  {id: 'PO_CREATE', label: 'Create purchase orders'},
  {id: 'PO_APPROVE', label: 'Approve purchase orders'},
  {id: 'GR_POST', label: 'Post goods receipts'},
  {id: 'INV_POST', label: 'Post supplier invoices'},
  {id: 'PAY_RELEASE', label: 'Release payments'},
  {id: 'USER_ADMIN', label: 'Administer ERP user access'},
];

export const RULES: SodRule[] = [
  {id: 'SOD-01', a: 'VENDOR_CREATE', b: 'PAY_RELEASE', risk: 'Create a fictitious vendor and pay it.', mitigation: 'Independent review of vendor master changes before first payment.'},
  {id: 'SOD-02', a: 'PO_CREATE', b: 'PO_APPROVE', risk: 'Approve own purchase orders.', mitigation: 'Workflow blocks self-approval; monthly report of self-approved POs.'},
  {id: 'SOD-03', a: 'PO_CREATE', b: 'GR_POST', risk: 'Order and confirm receipt of goods never delivered.', mitigation: 'Three-way match exceptions reviewed by finance.'},
  {id: 'SOD-04', a: 'INV_POST', b: 'PAY_RELEASE', risk: 'Post a false invoice and release payment.', mitigation: 'Dual control on payment runs.'},
  {id: 'SOD-05', a: 'USER_ADMIN', b: 'PAY_RELEASE', risk: 'Grant self additional access and move money.', mitigation: 'User administration separated from business roles; logged and reviewed.'},
  {id: 'SOD-06', a: 'VENDOR_CREATE', b: 'INV_POST', risk: 'Create a vendor and post invoices against it.', mitigation: 'Vendor bank-detail changes require call-back verification.'},
];

export function findConflicts(selected: Set<string>, rules: SodRule[] = RULES): SodRule[] {
  return rules.filter((r) => selected.has(r.a) && selected.has(r.b));
}

const labelOf = (id: string) => ENTITLEMENTS.find((e) => e.id === id)?.label ?? id;

export default function SodChecker(): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['PO_CREATE', 'PO_APPROVE']));
  const conflicts = findConflicts(selected);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className={styles.sod} aria-label="Segregation of duties checker">
      <div className={styles.sodCols}>
        <fieldset>
          <legend>Entitlements held by <em>Finance Analyst (fictional)</em></legend>
          {ENTITLEMENTS.map((e) => (
            <label key={e.id} className={styles.sodOption}>
              <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggle(e.id)} />
              <span>
                {e.label} <code>{e.id}</code>
              </span>
            </label>
          ))}
        </fieldset>
        <div role="status" aria-live="polite">
          <p className={clsx(styles.sodVerdict, conflicts.length ? styles.riskCritical : styles.riskLow)}>
            {conflicts.length === 0
              ? 'No SoD conflicts for this combination.'
              : `${conflicts.length} SoD conflict${conflicts.length > 1 ? 's' : ''} detected`}
          </p>
          {conflicts.map((c) => (
            <div key={c.id} className={styles.sodConflict}>
              <strong>{c.id}</strong>: {labelOf(c.a)} + {labelOf(c.b)}
              <div>
                <em>Risk:</em> {c.risk}
              </div>
              <div>
                <em>Mitigating control if the conflict must be accepted:</em> {c.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>
      <details>
        <summary>Show the rule set ({RULES.length} rules)</summary>
        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Entitlement A</th>
              <th>Entitlement B</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.a}</td>
                <td>{r.b}</td>
                <td>{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
