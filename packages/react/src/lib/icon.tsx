import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { ICONS, MIRRORED_ICONS, type IconName } from '@ghazal-ui/icons';
import { cx } from './class-names.js';

/** sm, md and lg, or any CSS length ('3rem'), or a number of pixels. */
export type IconSize = 'sm' | 'md' | 'lg' | number | (string & {});

const PRESETS = ['sm', 'md', 'lg'];

export interface IconProps extends Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> {
  name: IconName;
  size?: IconSize;
  /** What the icon means, for screen readers. Leave it out for a decorative icon. */
  label?: string;
}

/**
 * An icon that follows the text colour and the font size. Arrows and chevrons flip
 * in right-to-left pages. Without a `label` the icon is decoration and hidden from
 * screen readers, so put the meaning in nearby text or give it a label.
 *
 * ```tsx
 * <Icon name="search" label="Search" />
 * <Icon name="search" size="3rem" />
 * ```
 */
export function Icon({
  name,
  size = 'md',
  label,
  className,
  style,
  ...span
}: IconProps) {
  const preset = PRESETS.includes(String(size));
  const custom = preset
    ? undefined
    : typeof size === 'number'
      ? `${size}px`
      : size;
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...span}
      style={
        custom
          ? ({ '--ui-icon-size': custom, ...style } as CSSProperties)
          : style
      }
      className={cx(
        'ui-icon',
        preset && size !== 'md' && `ui-icon--${size}`,
        MIRRORED_ICONS.includes(name) && 'ui-icon--mirror',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        // The markup comes from our own build-time constants, never from user input.
        dangerouslySetInnerHTML={{ __html: ICONS[name] }}
      />
    </span>
  );
}
