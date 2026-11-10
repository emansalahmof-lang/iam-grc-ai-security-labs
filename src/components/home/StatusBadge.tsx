import React from 'react';
import clsx from 'clsx';
import {type ContentStatus, statusLabel} from '@site/src/data/catalog';
import styles from './home.module.css';

export default function StatusBadge({status}: {status: ContentStatus}): React.JSX.Element {
  return (
    <span className={clsx(styles.badge, styles[`badge_${status}`])} title={`Status: ${statusLabel[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
