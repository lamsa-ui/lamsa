import { AriaDescriber } from '@angular/cdk/a11y';
import type { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
} from '@angular/core';
import { anchoredOverlay } from '../popover/anchored';

/** The floating label itself. Added by `uiTooltip`. */
@Component({
  selector: 'ui-tooltip',
  host: { class: 'ui-tooltip', role: 'tooltip' },
  template: `{{ text() }}`,
})
export class TooltipPanelComponent {
  readonly text = input('');
}

/**
 * A short label for a control, shown on hover and on keyboard focus, and read by screen
 * readers as the control's description. The pointer can move onto it and Escape hides it
 * (WCAG 1.4.13). Touch screens never show it, so never hide something needed in a tooltip.
 * An icon-only button still needs its own `aria-label`.
 *
 * ```html
 * <button ui-button variant="ghost" aria-label="Copy link" uiTooltip="Copy link">…</button>
 * ```
 */
@Directive({
  selector: '[uiTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hideSoon()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
    '(keydown.escape)': 'hide()',
  },
})
export class TooltipDirective {
  readonly text = input.required<string>({ alias: 'uiTooltip' });

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private overlay?: OverlayRef;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    const describer = inject(AriaDescriber);
    effect((onCleanup) => {
      const text = this.text();
      describer.describe(this.host, text);
      onCleanup(() => describer.removeDescription(this.host, text));
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      this.overlay?.dispose();
    });
  }

  show(): void {
    clearTimeout(this.timer);
    if (!this.text() || this.overlay?.hasAttached()) return;
    this.overlay ??= this.create();
    const panel = this.overlay.attach(
      new ComponentPortal(TooltipPanelComponent),
    );
    panel.setInput('text', this.text());
  }

  hide(): void {
    clearTimeout(this.timer);
    this.overlay?.detach();
  }

  /** A short wait, so the pointer can cross the gap onto the tooltip. */
  protected hideSoon(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.hide(), 120);
  }

  private create(): OverlayRef {
    const overlay = anchoredOverlay(this.injector, this.host, [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
      },
    ]);
    const element = overlay.overlayElement;
    element.addEventListener('mouseenter', () => clearTimeout(this.timer));
    element.addEventListener('mouseleave', () => this.hideSoon());
    // Escape hides it wherever focus is, while it shows.
    overlay.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') this.hide();
    });
    return overlay;
  }
}
