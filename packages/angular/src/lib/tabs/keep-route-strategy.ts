import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  destroyDetachedRouteHandle,
  type DetachedRouteHandle,
} from '@angular/router';

/** The route's place in the URL, such as /account/billing, so each order keeps its own. */
const keyOf = (route: ActivatedRouteSnapshot) =>
  route.pathFromRoot
    .map((r) => r.url.map((segment) => segment.path).join('/'))
    .join('/');

/**
 * Keeps a routed tab's page, with what was typed and where it was scrolled, while the
 * reader moves between the tabs. Mark the route `data: { keep: true }`; the others are
 * made again on each visit. Leaving the section (the tabs' parent page) drops the kept
 * pages, so they never outlive it.
 *
 * ```ts
 * providers: [{ provide: RouteReuseStrategy, useClass: KeepRouteStrategy }]
 * { path: 'billing', component: Billing, data: { keep: true } }
 * ```
 */
@Injectable()
export class KeepRouteStrategy extends BaseRouteReuseStrategy {
  private readonly kept = new Map<string, DetachedRouteHandle>();
  /** Sections the current navigation leaves; pages under them are not kept. */
  private readonly leaving = new Set<string>();

  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    current: ActivatedRouteSnapshot,
  ): boolean {
    // Each navigation compares the trees from the root down, so the root starts a new one.
    if (!future.parent) this.leaving.clear();
    const reuse = super.shouldReuseRoute(future, current);
    if (!reuse) {
      // ponytail: drops the kept pages even if a guard then cancels leaving the section.
      const section = keyOf(current);
      this.leaving.add(section);
      for (const [key, handle] of this.kept) {
        if (key.startsWith(section + '/')) {
          destroyDetachedRouteHandle(handle);
          this.kept.delete(key);
        }
      }
    }
    return reuse;
  }

  override shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const key = keyOf(route);
    return (
      route.data['keep'] === true &&
      ![...this.leaving].some((section) => key.startsWith(section + '/'))
    );
  }

  override store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null,
  ): void {
    if (handle) this.kept.set(keyOf(route), handle);
    else this.kept.delete(keyOf(route));
  }

  override shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.kept.has(keyOf(route));
  }

  override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.kept.get(keyOf(route)) ?? null;
  }
}
