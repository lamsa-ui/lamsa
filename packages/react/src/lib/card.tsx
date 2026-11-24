import type { ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export interface CardProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title?: string;
  /** Heading level of the title, so it fits the page's heading outline. */
  level?: 2 | 3 | 4;
  padding?: 'md' | 'lg';
}

/**
 * A surface that groups related content, with an optional title.
 *
 * ```tsx
 * <Card title="Recent orders" level={2}>...</Card>
 * ```
 */
export function Card({
  title,
  level = 3,
  padding = 'md',
  className,
  children,
  ...div
}: CardProps) {
  const Heading = `h${level}` as const;
  return (
    <div
      {...div}
      className={cx('ui-card', padding === 'lg' && 'ui-card--lg', className)}
    >
      {title && <Heading className="ui-card__title">{title}</Heading>}
      {children}
    </div>
  );
}
