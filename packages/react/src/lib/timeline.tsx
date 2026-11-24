import type { IconName } from '@lamsa-ui/icons';
import { cx } from './class-names.js';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

export type TimelineStatus = 'approved' | 'pending' | 'rejected';

export interface TimelineItem {
  title: string;
  date: string;
  /** Machine-readable date, such as "2026-11-20T14:30:00Z". */
  dateTime?: string;
  actor?: string;
  description?: string;
  status?: TimelineStatus;
  /** Overrides the status text shown to users, including for translation. */
  statusLabel?: string;
}

export interface TimelineProps {
  /** Names the history list: "Approval history". */
  label: string;
  items: readonly TimelineItem[];
  className?: string;
}

const STATUS_ICONS: Record<TimelineStatus, IconName> = {
  approved: 'check',
  pending: 'clock',
  rejected: 'x',
};

/** A read-only, chronological record of decisions, such as a case's approval history. */
export function Timeline({ label, items, className }: TimelineProps) {
  const statusLabels = useUiLabels().timeline;
  return (
    <ol className={cx('ui-timeline', className)} aria-label={label}>
      {items.map((item, index) => (
        <li
          key={`${item.dateTime ?? item.date}-${index}`}
          className="ui-timeline__item"
        >
          <span
            className={cx(
              'ui-timeline__marker',
              item.status && `ui-timeline__marker--${item.status}`,
            )}
            aria-hidden="true"
          >
            {item.status && <Icon name={STATUS_ICONS[item.status]} />}
          </span>
          <article className="ui-timeline__content">
            <div className="ui-timeline__heading">
              <h3 className="ui-timeline__title">{item.title}</h3>
              {item.status && (
                <span
                  className={cx(
                    'ui-timeline__status',
                    `ui-timeline__status--${item.status}`,
                  )}
                >
                  {item.statusLabel ?? statusLabels[item.status]}
                </span>
              )}
            </div>
            <p className="ui-timeline__meta">
              {item.actor && <span>{item.actor}</span>}
              <time dateTime={item.dateTime}>{item.date}</time>
            </p>
            {item.description && (
              <p className="ui-timeline__description">{item.description}</p>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
