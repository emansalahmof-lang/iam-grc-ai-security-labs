import React, {useState} from 'react';
import clsx from 'clsx';
import styles from './lab.module.css';

export type Rating = 'best' | 'acceptable' | 'risky';
export interface Choice {
  text: string;
  rating: Rating;
  feedback: string;
}

const ratingLabel: Record<Rating, string> = {
  best: 'Best practice',
  acceptable: 'Acceptable with conditions',
  risky: 'Risky',
};

/**
 * Scenario-based decision exercise. Unlike a quiz, several answers can be
 * defensible; each choice explains its trade-off. Nothing is stored.
 */
export default function DecisionScenario({
  title,
  scenario,
  choices,
}: {
  title: string;
  scenario: string;
  choices: Choice[];
}): React.JSX.Element {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <section className={styles.scenario} aria-label={`Scenario: ${title}`}>
      <p className={styles.scenarioTag}>Decision scenario · simulated</p>
      <h4 className={styles.scenarioTitle}>{title}</h4>
      <p>{scenario}</p>
      <div className={styles.scenarioChoices}>
        {choices.map((c, i) => (
          <button
            key={c.text}
            type="button"
            aria-pressed={picked === i}
            className={clsx(styles.scenarioChoice, picked === i && styles.scenarioPicked)}
            onClick={() => setPicked(i)}>
            {c.text}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div
          className={clsx(
            styles.scenarioResult,
            choices[picked].rating === 'best' && styles.riskLow,
            choices[picked].rating === 'acceptable' && styles.riskMedium,
            choices[picked].rating === 'risky' && styles.riskCritical,
          )}
          role="status">
          <strong>{ratingLabel[choices[picked].rating]}.</strong> {choices[picked].feedback}
        </div>
      )}
    </section>
  );
}
