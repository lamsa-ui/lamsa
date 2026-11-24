import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  Component,
  type ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { TONE_ICONS } from '../alert/tone-icon';
import { ButtonComponent } from '../button/button.component';
import type { AlertTone } from '../dialog/alert-dialog';

export interface ToastOptions {
  tone?: AlertTone;
  /** A few words in bold before the message. */
  title?: string;
  /**
   * How long it stays, in milliseconds; 0 keeps it until it is closed. Defaults to
   * 6000, or 0 when there is an action, so nobody loses the action to a timer.
   */
  duration?: number;
  /** One button, such as Undo. Pressing it closes the toast. */
  action?: { label: string; run: () => void };
}

export interface Toast extends ToastOptions {
  id: number;
  message: string;
}

/** The landmark at the end of the page that holds the toasts. Added by UiToast. */
@Component({
  selector: 'ui-toast-region',
  imports: [IconComponent, ButtonComponent],
  host: {
    // A block: inline, the empty host made a line box under the page (a scrollbar on a full-height page).
    '[style.display]': "'block'",
    '[attr.role]': "toasts.toasts().length ? 'region' : null",
    '[attr.aria-label]':
      'toasts.toasts().length ? toasts.labels().region : null',
    '(mouseenter)': 'toasts.pause()',
    '(mouseleave)': 'toasts.resume()',
    '(focusin)': 'toasts.pause()',
    '(focusout)': 'toasts.resume()',
  },
  template: `
    <ol class="ui-toast-region" popover="manual">
      @for (toast of toasts.toasts(); track toast.id) {
        <li
          class="ui-alert ui-toast ui-alert--{{ toast.tone ?? 'info' }}"
          data-testid="ui-toast"
        >
          <ui-icon
            class="ui-alert__icon"
            [name]="toneIcons[toast.tone ?? 'info']"
          />
          <div class="ui-alert__body">
            @if (toast.title) {
              <p class="ui-alert__title">{{ toast.title }}</p>
            }
            <p>{{ toast.message }}</p>
            @if (toast.action; as action) {
              <div class="ui-alert__actions">
                <button
                  ui-button
                  variant="secondary"
                  size="sm"
                  type="button"
                  (click)="action.run(); toasts.dismiss(toast.id)"
                >
                  {{ action.label }}
                </button>
              </div>
            }
          </div>
          <button
            ui-button
            variant="ghost"
            type="button"
            class="ui-alert__close"
            [attr.aria-label]="toasts.labels().close"
            (click)="toasts.dismiss(toast.id)"
          >
            <ui-icon name="x" size="sm" />
          </button>
        </li>
      }
    </ol>
  `,
})
export class ToastRegionComponent {
  protected readonly toneIcons = TONE_ICONS;
  protected readonly toasts = inject(UiToast);
}

/**
 * Short notes after an action ("Saved", "Message sent"), at the bottom end of the screen.
 * Screen readers hear each one as it comes (danger at once, the rest politely), timers
 * pause while the pointer or focus is on a toast, and the region is a landmark.
 *
 * ```ts
 * const toast = inject(UiToast);
 * toast.show('Address saved', { tone: 'success' });
 * toast.show('Order deleted', { action: { label: 'Undo', run: () => restore() } });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UiToast {
  /** The region's name and the close buttons' name; set the translated text once. */
  readonly labels = signal({ region: 'Notifications', close: 'Dismiss' });
  /** The toasts on screen, oldest first. */
  readonly toasts = signal<readonly Toast[]>([]);

  private readonly announcer = inject(LiveAnnouncer);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private region?: ComponentRef<ToastRegionComponent>;
  private list?: HTMLElement;
  private paused = false;
  private nextId = 0;

  /** Shows a toast and returns its id, for `dismiss()`. */
  show(message: string, options: ToastOptions = {}): number {
    this.attach();
    const toast: Toast = { ...options, message, id: this.nextId++ };
    this.toasts.update((list) => [...list, toast]);
    void this.announcer.announce(
      [options.title, message].filter(Boolean).join('. '),
      options.tone === 'danger' ? 'assertive' : 'polite',
    );
    if (!this.paused) this.start(toast);
    this.raise();
    return toast.id;
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  /** Stops every timer, while the reader is on a toast. */
  pause(): void {
    this.paused = true;
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  // ponytail: a toast gets its full time again after a pause, not what was left; fine for 6 s notes.
  resume(): void {
    this.paused = false;
    this.toasts().forEach((toast) => this.start(toast));
  }

  private start(toast: Toast): void {
    const duration = toast.duration ?? (toast.action ? 0 : 6000);
    if (duration > 0)
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), duration),
      );
  }

  private attach(): void {
    if (this.region) return;
    this.region = createComponent(ToastRegionComponent, {
      environmentInjector: this.injector,
    });
    this.appRef.attachView(this.region.hostView);
    this.document.body.appendChild(this.region.location.nativeElement);
    this.region.changeDetectorRef.detectChanges();
    const list = (this.list =
      this.region.location.nativeElement.firstElementChild);
    // A drawer, menu or tooltip opened after a toast would cover it: raise it again.
    // toggle does not bubble, so listen while it travels down (capture).
    this.document.addEventListener(
      'toggle',
      (event) => {
        if (event.target !== list && this.toasts().length) this.raise();
      },
      true,
    );
  }

  /**
   * The CDK opens every overlay in the browser's top layer, above any z-index, newest
   * on top. The toasts live there too and go back on top after each new overlay.
   */
  private raise(): void {
    const list = this.list;
    if (!list || !('showPopover' in list)) return; // no top layer: z-index does it
    if (list.matches(':popover-open')) list.hidePopover();
    list.showPopover();
  }
}
