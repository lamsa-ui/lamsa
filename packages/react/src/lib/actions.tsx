'use client';

import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { Toolbar as AriaToolbar } from 'react-aria-components';
import type { ButtonSize } from './button.js';
import { cx } from './class-names.js';

export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
  /** What the buttons do together, for screen readers: "Text alignment". */
  label: string;
}

/**
 * Buttons that belong together, joined into one bar and named as a group.
 *
 * ```tsx
 * <ButtonGroup label="Text alignment">
 *   <Button variant="secondary">Start</Button>
 *   <Button variant="secondary">Centre</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({ label, className, ...div }: ButtonGroupProps) {
  return (
    <div
      {...div}
      role="group"
      aria-label={label}
      className={cx('ui-button-group', className)}
    />
  );
}

export interface ToggleProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'onChange'
> {
  /** Pressed now; pass it with `onPressedChange` to control the toggle. */
  pressed?: boolean;
  /** Pressed at first, when the toggle keeps its own state. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: ButtonSize;
  /** A square toggle whose only content is an icon. Give it an `aria-label`. */
  iconOnly?: boolean;
}

/**
 * A button that stays pressed until pressed again, such as "Pin" or a view switch.
 * Screen readers hear "pressed" or "not pressed". Keep the label the same in both states.
 *
 * ```tsx
 * <Toggle pressed={pinned} onPressedChange={setPinned}>Pin</Toggle>
 * ```
 */
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  size = 'md',
  iconOnly = false,
  className,
  onClick,
  ...button
}: ToggleProps) {
  const [own, setOwn] = useState(defaultPressed);
  const on = pressed ?? own;
  return (
    <button
      type="button"
      {...button}
      aria-pressed={on}
      className={cx(
        'ui-button ui-button--secondary',
        `ui-button--${size}`,
        'ui-toggle',
        iconOnly && 'ui-button--icon',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (pressed === undefined) setOwn(!on);
        onPressedChange?.(!on);
      }}
    />
  );
}

export interface ToolbarProps {
  /** What the controls act on, for screen readers: "Order actions". */
  label: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: ReactNode;
}

/**
 * A row of controls that is one tab stop, on React Aria: Tab enters and leaves it, the
 * arrow keys move inside it (flipped in right-to-left pages).
 *
 * ```tsx
 * <Toolbar label="Order actions">
 *   <Button variant="ghost">Print</Button>
 *   <Button variant="ghost">Refund</Button>
 * </Toolbar>
 * ```
 */
export function Toolbar({
  label,
  orientation = 'horizontal',
  className,
  children,
}: ToolbarProps) {
  return (
    <AriaToolbar
      aria-label={label}
      orientation={orientation}
      className={cx('ui-toolbar', className)}
    >
      {children}
    </AriaToolbar>
  );
}

/** A thin line between groups of controls in a toolbar. */
export function ToolbarSeparator() {
  return <div role="separator" className="ui-toolbar__separator" />;
}

/**
 * A key on the keyboard, on the native `<kbd>`. For a shortcut, one per key:
 *
 * ```tsx
 * <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
 * ```
 */
export function Kbd({ className, ...kbd }: ComponentPropsWithRef<'kbd'>) {
  return <kbd {...kbd} className={cx('ui-kbd', className)} />;
}

export type MeterTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface MeterProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children'
> {
  label: string;
  value: number;
  min?: number;
  max?: number;
  /** The value in words, such as "7.2 of 10 GB". Defaults to a percentage. */
  valueText?: string;
  tone?: MeterTone;
}

/** Where value sits between min and max, from 0 to 1, clamped. */
export function meterRatio(value: number, min: number, max: number): number {
  return Math.min(Math.max((value - min) / (max - min || 1), 0), 1);
}

/**
 * A level inside a known range, such as storage used or a score: not work in progress
 * (that is Progress). The value is written beside the label; the tone only repeats it.
 *
 * ```tsx
 * <Meter label="Storage" value={72} valueText="7.2 of 10 GB" tone="warning" />
 * ```
 */
export function Meter({
  label,
  value,
  min = 0,
  max = 100,
  valueText,
  tone = 'neutral',
  className,
  ...div
}: MeterProps) {
  const ratio = meterRatio(value, min, max);
  const text =
    valueText ??
    new Intl.NumberFormat(undefined, { style: 'percent' }).format(ratio);
  const labelId = `${useId()}-label`;
  return (
    <div
      {...div}
      className={cx(
        'ui-meter',
        tone !== 'neutral' && `ui-meter--${tone}`,
        className,
      )}
    >
      <div className="ui-meter__head">
        <span className="ui-meter__label" id={labelId}>
          {label}
        </span>
        <span className="ui-meter__value" aria-hidden="true">
          {text}
        </span>
      </div>
      <div
        className="ui-meter__bar"
        role="meter"
        aria-labelledby={labelId}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={text}
      >
        <span
          className="ui-meter__fill"
          style={{ '--ui-meter-value': `${ratio * 100}%` } as object}
        />
      </div>
    </div>
  );
}

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface StatusDotProps extends ComponentPropsWithRef<'span'> {
  tone?: StatusTone;
}

/**
 * A coloured dot before the word for a status: "Online", "Busy". The word carries the
 * meaning, so it is always there; the dot only repeats it.
 *
 * ```tsx
 * <StatusDot tone="success">Online</StatusDot>
 * ```
 */
export function StatusDot({
  tone = 'neutral',
  className,
  ...span
}: StatusDotProps) {
  return (
    <span
      {...span}
      className={cx(
        'ui-status-dot',
        tone !== 'neutral' && `ui-status-dot--${tone}`,
        className,
      )}
    />
  );
}

export interface PropertyListProps extends ComponentPropsWithRef<'dl'> {
  layout?: 'columns' | 'stacked';
}

/**
 * Label and value pairs on a native `<dl>`, such as order details. Two columns when
 * there is room; label above value when the list is narrow or `layout="stacked"`.
 *
 * ```tsx
 * <PropertyList>
 *   <Property term="Order">#1042</Property>
 * </PropertyList>
 * ```
 */
export function PropertyList({
  layout = 'columns',
  className,
  ...dl
}: PropertyListProps) {
  return (
    <dl
      {...dl}
      className={cx(
        'ui-property-list',
        layout === 'stacked' && 'ui-property-list--stacked',
        className,
      )}
    />
  );
}

export interface PropertyProps {
  term: string;
  children?: ReactNode;
}

/** One pair in a property list: the term, and the value as children. */
export function Property({ term, children }: PropertyProps) {
  return (
    <div className="ui-property-list__item">
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
