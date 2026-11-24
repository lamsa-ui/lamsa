import type { ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';
import { useUiLabels } from './labels.js';

export interface BreadcrumbsProps extends ComponentPropsWithRef<'nav'> {
  /** Names the landmark; pass the translated text. */
  label?: string;
}

/**
 * Where the page sits: a navigation landmark around a list. Put each link in an `<li>`;
 * the last item is the page itself, with `aria-current="page"` and no link.
 *
 * ```tsx
 * <Breadcrumbs>
 *   <li><a href="/orders">Orders</a></li>
 *   <li><span aria-current="page">Order 1042</span></li>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  label,
  className,
  children,
  ...nav
}: BreadcrumbsProps) {
  const t = useUiLabels();
  label ??= t.breadcrumb;
  return (
    <nav
      {...nav}
      aria-label={label}
      className={cx('ui-breadcrumbs', className)}
    >
      <ol>{children}</ol>
    </nav>
  );
}

export interface NavProps extends ComponentPropsWithRef<'nav'> {
  /** Names the landmark, so it differs from other navigation on the page. */
  label: string;
}

/**
 * The app's main links, in a side bar. Mark the current page's link `aria-current="page"`.
 *
 * ```tsx
 * <Nav label="Main">
 *   <ul><li><a href="/orders" aria-current="page">Orders</a></li></ul>
 * </Nav>
 * ```
 */
export function Nav({ label, className, ...nav }: NavProps) {
  return (
    <nav {...nav} aria-label={label} className={cx('ui-nav', className)} />
  );
}
