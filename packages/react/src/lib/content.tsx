import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { cx } from './class-names.js';
import type { IconName } from '@lamsa-ui/icons';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

/** Keeps two Arabic initials apart, so ح and م never join into «حم». Invisible in Latin. */
const ZWNJ = '\u200c';

/** First letter of the first and last word: "Hatem Mohamed" → "HM", "حاتم محمد" → ح and م, kept apart. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = (word = '') => Array.from(word)[0] ?? '';
  const letters =
    words.length > 1
      ? first(words[0]) + ZWNJ + first(words[words.length - 1])
      : first(words[0]);
  return letters.toLocaleUpperCase();
}

export interface AvatarProps extends Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  /** The name is already on screen next to the avatar. */
  decorative?: boolean;
}

/**
 * A person's photo, or their initials when there is no photo or it fails to load.
 * Screen readers hear the name; set `decorative` when the name is written next to it.
 *
 * ```tsx
 * <Avatar name="Hatem Mohamed" src="/hatem.jpg" />
 * ```
 */
export function Avatar({
  name,
  src,
  size = 'md',
  decorative = false,
  className,
  ...span
}: AvatarProps) {
  const [failed, setFailed] = useState<string>();
  return (
    <span
      {...span}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cx(
        'ui-avatar',
        size !== 'md' && `ui-avatar--${size}`,
        className,
      )}
    >
      {src && failed !== src ? (
        <img src={src} alt="" onError={() => setFailed(src)} />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export interface DividerProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children'
> {
  orientation?: 'horizontal' | 'vertical';
  /** Words in the middle of the line. Horizontal only. */
  label?: string;
}

/**
 * A thin rule between groups of content. With a `label` ("or") the words sit in the middle
 * and are read as text; without one it is a separator.
 */
export function Divider({
  orientation = 'horizontal',
  label,
  className,
  ...div
}: DividerProps) {
  if (label) {
    return (
      <div {...div} className={cx('ui-divider ui-divider--label', className)}>
        {label}
      </div>
    );
  }
  return (
    <div
      {...div}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx(
        'ui-divider',
        orientation === 'vertical' && 'ui-divider--vertical',
        className,
      )}
    />
  );
}

export interface EmptyStateProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'title'
> {
  title: string;
  /** Heading level of the title, so it fits the page's heading outline. */
  level?: 2 | 3 | 4;
  /** The one action that fills the empty space, usually a button. */
  actions?: ReactNode;
}

/**
 * Shown where a list or table has nothing yet: what belongs here, why it is empty,
 * and the one action that fills it.
 *
 * ```tsx
 * <EmptyState title="No orders yet" actions={<Button>Share your menu</Button>}>
 *   <p>Orders show here once a customer pays.</p>
 * </EmptyState>
 * ```
 */
export function EmptyState({
  title,
  level = 3,
  actions,
  className,
  children,
  ...div
}: EmptyStateProps) {
  const Heading = `h${level}` as const;
  return (
    <div {...div} className={cx('ui-empty-state', className)}>
      <Heading className="ui-empty-state__title">{title}</Heading>
      {children}
      {actions && <div className="ui-empty-state__actions">{actions}</div>}
    </div>
  );
}

export type StatTrend = 'up' | 'down' | 'flat';
export type StatTone = 'positive' | 'negative' | 'neutral';

/** Up, down or level: the arrow repeats what the words say. */
const trendIcons: Record<StatTrend, IconName> = {
  up: 'arrow-up',
  down: 'arrow-down',
  flat: 'minus',
};

export interface StatProps extends ComponentPropsWithRef<'div'> {
  label: string;
  value: string;
  /** How it changed, in words or with a sign: "+12% on last month". */
  change?: string;
  /** The arrow beside the change. */
  trend?: StatTrend;
  /** The colour of the change: good, bad or neither. Up is not always good. */
  tone?: StatTone;
}

/**
 * One number with its label, and how it changed. The change reads alone;
 * the arrow and colour only repeat it.
 *
 * ```tsx
 * <Stat label="Revenue" value="EGP 84,200" change="+12% on last month" trend="up" tone="positive" />
 * ```
 */
export function Stat({
  label,
  value,
  change,
  trend,
  tone = 'neutral',
  className,
  ...div
}: StatProps) {
  return (
    <div {...div} className={cx('ui-stat', className)}>
      <p className="ui-stat__label">{label}</p>
      <p className="ui-stat__value">{value}</p>
      {change && (
        <p
          className={cx(
            'ui-stat__change',
            tone !== 'neutral' && `ui-stat__change--${tone}`,
          )}
        >
          {trend && <Icon name={trendIcons[trend]} />}
          {change}
        </p>
      )}
    </div>
  );
}

export interface TagProps extends ComponentPropsWithRef<'span'> {
  /** Shows the × button; called when it is pressed. Then move focus to the next tag. */
  onRemove?: () => void;
  /** First word of the remove button's name; the tag's text follows it. */
  removeLabel?: string;
}

/**
 * A label the user added or can take away, such as an active filter. For a status use a badge.
 *
 * ```tsx
 * <Tag onRemove={() => drop('angular')}>Angular</Tag>
 * ```
 */
export function Tag({
  onRemove,
  removeLabel,
  className,
  children,
  ...span
}: TagProps) {
  const t = useUiLabels();
  removeLabel ??= t.remove;
  const id = useId();
  return (
    <span {...span} className={cx('ui-tag', className)}>
      <span id={id}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className="ui-tag__remove"
          id={`${id}-remove`}
          aria-label={removeLabel}
          aria-labelledby={`${id}-remove ${id}`}
          onClick={onRemove}
        >
          <Icon name="x" />
        </button>
      )}
    </span>
  );
}

export interface AvatarPerson {
  name: string;
  src?: string;
}

export interface AvatarGroupProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children'
> {
  /** Who the group is, for screen readers: "Kitchen team". */
  label: string;
  people: readonly AvatarPerson[];
  /** How many avatars to show before "+n". */
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  /** The name of "+n", translated: (n) => `${n} more`. */
  moreLabel?: (count: number) => string;
}

/**
 * Several people in a small space: the first few avatars overlap, and "+3" stands for
 * the rest. Every avatar is still named, and the group has a name of its own.
 *
 * ```tsx
 * <AvatarGroup label="Kitchen team" people={team} max={3} />
 * ```
 */
export function AvatarGroup({
  label,
  people,
  max = 4,
  size = 'md',
  moreLabel,
  className,
  ...div
}: AvatarGroupProps) {
  const t = useUiLabels();
  moreLabel ??= t.more;
  const rest = Math.max(people.length - max, 0);
  return (
    <div
      {...div}
      role="group"
      aria-label={label}
      className={cx('ui-avatar-group', className)}
    >
      {people.slice(0, max).map((person, i) => (
        <Avatar key={i} name={person.name} src={person.src} size={size} />
      ))}
      {rest > 0 && (
        <span
          role="img"
          aria-label={moreLabel(rest)}
          className={cx(
            'ui-avatar ui-avatar-group__more',
            size !== 'md' && `ui-avatar--${size}`,
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
