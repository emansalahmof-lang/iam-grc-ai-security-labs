import React from 'react';
import type {ContentStatus, Difficulty} from '@site/src/data/catalog';
import StatusBadge from '@site/src/components/home/StatusBadge';
import styles from './lab.module.css';

export interface LabMetaProps {
  id: string;
  difficulty: Difficulty;
  duration: string;
  status: ContentStatus;
  /** e.g. "Microsoft Entra ID Free" or "Entra ID P1 (path B)" */
  licences: string[];
  prerequisites: string[];
  tools: string[];
  /** ISO date the lab content was last reviewed against its references */
  reviewed: string;
}

const statusExplanation: Record<ContentStatus, string> = {
  planned: 'Scope agreed; content not yet written.',
  draft:
    'Lab guide: complete step-by-step instructions, checked against the official references listed at the end. Not yet executed end-to-end in a lab tenant, so no execution evidence is published yet.',
  simulated: 'Uses fictional organisations and data only. No real tenant is involved.',
  validated: 'Executed end-to-end in an isolated test tenant. Redacted execution evidence is published in the Validation record section.',
};

export default function LabMeta(props: LabMetaProps): React.JSX.Element {
  const {id, difficulty, duration, status, licences, prerequisites, tools, reviewed} = props;
  return (
    <aside className={styles.meta} aria-label={`${id} summary`}>
      <div className={styles.metaHeader}>
        <span className={styles.metaId}>{id}</span>
        <StatusBadge status={status} />
      </div>
      <dl className={styles.metaGrid}>
        <div>
          <dt>Difficulty</dt>
          <dd>{difficulty}</dd>
        </div>
        <div>
          <dt>Estimated duration</dt>
          <dd>{duration}</dd>
        </div>
        <div>
          <dt>Licences</dt>
          <dd>
            <ul>
              {licences.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Prerequisites</dt>
          <dd>
            <ul>
              {prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Tools</dt>
          <dd>
            <ul>
              {tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>References last reviewed</dt>
          <dd>{reviewed}</dd>
        </div>
      </dl>
      <p className={styles.metaStatus}>{statusExplanation[status]}</p>
    </aside>
  );
}
