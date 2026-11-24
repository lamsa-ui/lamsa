import {
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
  createRepositionScrollStrategy,
  type ConnectedPosition,
  type OverlayRef,
} from '@angular/cdk/overlay';
import type { Injector } from '@angular/core';

/**
 * An overlay pinned to `origin`, trying each position in turn and following the page as it scrolls.
 * It is placed right after `origin` in the DOM (still shown in the top layer), so it sits inside
 * the same landmark and follows the trigger in reading order.
 */
export function anchoredOverlay(
  injector: Injector,
  origin: HTMLElement,
  positions: ConnectedPosition[],
  /** Slide it back inside the screen when no position fits, as a wide panel on a phone. */
  push = false,
): OverlayRef {
  return createOverlayRef(injector, {
    positionStrategy: createFlexibleConnectedPositionStrategy(injector, origin)
      .withPositions(positions)
      .withViewportMargin(8)
      .withPush(push)
      .withPopoverLocation('inline'),
    scrollStrategy: createRepositionScrollStrategy(injector),
  });
}
