import React, {useState} from 'react';
import clsx from 'clsx';
import styles from './lab.module.css';

export interface Question {
  q: string;
  options: string[];
  /** zero-based index of the correct option */
  answer: number;
  explanation: string;
}

/**
 * Self-marking quiz. Runs entirely in the browser; answers are not stored
 * or sent anywhere.
 */
export default function KnowledgeCheck({
  questions,
  title = 'Knowledge check',
}: {
  questions: Question[];
  title?: string;
}): React.JSX.Element {
  const [selected, setSelected] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const score = selected.reduce<number>((acc, s, i) => (s === questions[i].answer ? acc + 1 : acc), 0);
  const allAnswered = selected.every((s) => s !== null);

  return (
    <section className={styles.quiz} aria-label={title}>
      <h3 className={styles.quizTitle}>{title}</h3>
      <ol className={styles.quizList}>
        {questions.map((question, qi) => {
          const name = `q-${qi}-${question.q.slice(0, 12).replace(/\W/g, '')}`;
          return (
            <li key={name} className={styles.quizItem}>
              <fieldset disabled={submitted}>
                <legend className={styles.quizQuestion}>
                  <span className={styles.quizNumber}>{qi + 1}.</span> {question.q}
                </legend>
                {question.options.map((opt, oi) => {
                  const isCorrect = oi === question.answer;
                  const isChosen = selected[qi] === oi;
                  return (
                    <label
                      key={opt}
                      className={clsx(
                        styles.quizOption,
                        submitted && isCorrect && styles.quizCorrect,
                        submitted && isChosen && !isCorrect && styles.quizWrong,
                      )}>
                      <input
                        type="radio"
                        name={name}
                        checked={isChosen}
                        onChange={() =>
                          setSelected((prev) => prev.map((v, i) => (i === qi ? oi : v)))
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
                {submitted && (
                  <p className={styles.quizExplanation}>
                    <strong>{selected[qi] === question.answer ? 'Correct. ' : 'Not quite. '}</strong>
                    {question.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <div className={styles.quizFooter}>
        {!submitted ? (
          <button
            type="button"
            className="button button--primary"
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}>
            Check answers
          </button>
        ) : (
          <>
            <span className={styles.quizScore} role="status">
              Score: {score} / {questions.length}
            </span>
            <button
              type="button"
              className="button button--secondary button--outline"
              onClick={() => {
                setSelected(questions.map(() => null));
                setSubmitted(false);
              }}>
              Try again
            </button>
          </>
        )}
        {!submitted && !allAnswered && (
          <span className={styles.quizHint}>Answer every question to check your score.</span>
        )}
      </div>
    </section>
  );
}
