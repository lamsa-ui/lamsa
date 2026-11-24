import { NgTemplateOutlet } from '@angular/common';
import type { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  afterNextRender,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  type TemplateRef,
} from '@angular/core';
import { anchoredOverlay } from './anchored';

let nextId = 0;

/** The panel that holds a popover's content. Added by `uiPopoverTrigger`. */
@Component({
  selector: 'ui-popover',
  imports: [NgTemplateOutlet],
  host: {
    class: 'ui-popover',
    role: 'dialog',
    tabindex: '-1',
    '[id]': 'id()',
    '[attr.aria-labelledby]': 'labelledBy()',
  },
  template: `<ng-container [ngTemplateOutlet]="content()" />`,
})
export class PopoverPanelComponent {
  readonly content = input<TemplateRef<unknown> | null>(null);
  readonly id = input('');
  readonly labelledBy = input('');
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Opens a small panel next to its button, for a few details or settings. Not modal:
 * focus moves into it, Escape or a click outside closes it and focus returns to the
 * button. The panel is named after the button. On a narrow screen it slides back inside.
 *
 * ```html
 * <button ui-button variant="secondary" [uiPopoverTrigger]="info">Delivery fee</button>
 * <ng-template #info><p>Free over EGP 500.</p></ng-template>
 * ```
 */
@Directive({
  selector: '[uiPopoverTrigger]',
  host: {
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'open() ? panelId : null',
    '(click)': 'open() ? close() : show()',
  },
})
export class PopoverTriggerDirective {
  readonly content = input.required<TemplateRef<unknown>>({
    alias: 'uiPopoverTrigger',
  });

  protected readonly open = signal(false);
  protected readonly panelId = `ui-popover-${nextId++}`;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private overlay?: OverlayRef;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.overlay?.dispose());
  }

  show(): void {
    this.host.id ||= `${this.panelId}-trigger`;
    this.overlay ??= this.create();
    const panel = this.overlay.attach(
      new ComponentPortal(PopoverPanelComponent),
    );
    panel.setInput('content', this.content());
    panel.setInput('id', this.panelId);
    panel.setInput('labelledBy', this.host.id);
    this.open.set(true);
    const element: HTMLElement = panel.location.nativeElement;
    afterNextRender(
      () => (element.querySelector<HTMLElement>(FOCUSABLE) ?? element).focus(),
      { injector: this.injector },
    );
  }

  close(returnFocus = true): void {
    if (!this.open()) return;
    this.overlay?.detach();
    this.open.set(false);
    if (returnFocus) this.host.focus();
  }

  private create(): OverlayRef {
    const overlay = anchoredOverlay(
      this.injector,
      this.host,
      [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -8,
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ],
      true,
    );
    overlay.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });
    overlay.outsidePointerEvents().subscribe((event) => {
      // The button's own click toggles it, so leave that click to the button.
      if (!this.host.contains(event.target as Node)) this.close(false);
    });
    // ponytail: Tab out of the panel closes it without moving focus; add a focus trap if a popover ever holds a long form.
    overlay.overlayElement.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && !overlay.overlayElement.contains(next) && next !== this.host)
        this.close(false);
    });
    return overlay;
  }
}
