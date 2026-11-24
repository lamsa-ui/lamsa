import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './button.js';
import { cx } from './class-names.js';
import { Icon } from './icon.js';

export interface StepItem {
  label: string;
  /** Shown while this is the current step; it stays mounted, so typed values are kept. */
  content: ReactNode;
  /**
   * Whether the step is filled in, such as its form being valid. In a linear stepper, Next
   * and the later steps wait for it. Defaults to true.
   */
  completed?: boolean;
}

export interface StepperProps {
  /** Names the list of steps: "Checkout". */
  label: string;
  steps: readonly StepItem[];
  /** Index of the current step, from 0, when you control it. */
  current?: number;
  defaultCurrent?: number;
  onChange?: (index: number) => void;
  /** Steps are reached in order: each waits for the ones before it to be completed. */
  linear?: boolean;
  /** Finish was pressed on the last step (in a linear stepper, only once it is completed). */
  onFinish?: () => void;
  /** In a linear stepper, Next or Finish was pressed on this step while it is not completed. */
  onBlocked?: (index: number) => void;
  /** Read before each done step. Translate it, and the button labels. */
  doneLabel?: string;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  /** The marker's number: (n) => n.toLocaleString('ar-EG') for Arabic digits. */
  number?: (n: number) => string;
  className?: string;
}

/**
 * A flow split into steps, such as checkout. Each step holds its own content; the stepper
 * shows the current one with Back and Next under it, and Next on the last step says
 * Finish. The step names are buttons, so people can go back to a step. With `linear`, a
 * step can only be reached once every step before it is completed, and Next on a step
 * that is not calls `onBlocked`, so you can show its errors. After a change, focus moves
 * to the new step's content.
 *
 * ```tsx
 * <Stepper label="Checkout" linear onFinish={pay} steps={[
 *   { label: 'Address', content: <Address />, completed: addressValid },
 *   { label: 'Payment', content: <Payment />, completed: cardValid },
 * ]} />
 * ```
 */
export function Stepper({
  label,
  steps,
  current: controlled,
  defaultCurrent = 0,
  onChange,
  linear = false,
  onFinish,
  onBlocked,
  doneLabel = 'Done',
  backLabel = 'Back',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  number = String,
  className,
}: StepperProps) {
  const id = useId();
  const [own, setOwn] = useState(defaultCurrent);
  const current = controlled ?? own;
  const panels = useRef<(HTMLElement | null)[]>([]);
  const focusPending = useRef(false);

  // The new panel shows on this render; focus lands there for screen readers.
  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    panels.current[current]?.focus();
  }, [current]);

  const completed = (i: number) => steps[i]?.completed ?? true;
  const reachable = (i: number) =>
    !linear || steps.slice(0, i).every((_, j) => completed(j));
  const go = (i: number) => {
    if (i === current) return;
    focusPending.current = true;
    setOwn(i);
    onChange?.(i);
  };
  const next = () => {
    if (linear && !completed(current)) onBlocked?.(current);
    else if (current === steps.length - 1) onFinish?.();
    else go(current + 1);
  };

  return (
    <div className={cx('ui-stepper', className)}>
      <ol className="ui-steps" aria-label={label}>
        {steps.map((step, i) => {
          const done = i < current && completed(i);
          return (
            <li
              key={i}
              className={cx(
                'ui-steps__item',
                done && 'ui-steps__item--done',
                i === current && 'ui-steps__item--current',
              )}
            >
              <button
                type="button"
                className="ui-steps__step"
                id={`${id}-step-${i}`}
                aria-current={i === current ? 'step' : undefined}
                disabled={!reachable(i)}
                onClick={() => go(i)}
              >
                <span className="ui-steps__marker" aria-hidden="true">
                  {done ? <Icon name="check" /> : number(i + 1)}
                </span>
                <span className="ui-steps__label">
                  {done && (
                    <span className="ui-visually-hidden">{doneLabel}: </span>
                  )}
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {steps.map((step, i) => (
        <section
          key={i}
          ref={(el) => {
            panels.current[i] = el;
          }}
          className="ui-stepper__panel"
          tabIndex={-1}
          aria-labelledby={`${id}-step-${i}`}
          hidden={i !== current}
        >
          {step.content}
        </section>
      ))}
      <div className="ui-stepper__actions">
        {current > 0 && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => go(current - 1)}
          >
            {backLabel}
          </Button>
        )}
        <Button type="button" onClick={next}>
          {current === steps.length - 1 ? finishLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
}
