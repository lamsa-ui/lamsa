import { Component, computed, inject, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import type { AlertTone } from '../dialog/alert-dialog';
import { IconComponent } from '../icon/icon.component';
import { TONE_ICONS } from './tone-icon';
import { UI_LABELS } from '../labels';

/**
 * A message in the page, such as a problem with the whole form or a notice about an
 * account. The title says the tone in words; the icon and colour repeat it.
 *
 * It is not announced when the page loads. For a message that appears after an action,
 * add `role="alert"` (urgent) or `role="status"`, or use a toast.
 *
 * ```html
 * <ui-alert tone="warning" title="Your plan ends on 1 December">
 *   Renew it to keep your reports.
 *   <div ui-alert-actions><button ui-button size="sm">Renew</button></div>
 * </ui-alert>
 * ```
 */
@Component({
  selector: 'ui-alert',
  imports: [IconComponent, ButtonComponent],
  host: { '[class]': 'classes()' },
  template: `
    <ui-icon class="ui-alert__icon" [name]="toneIcons[tone()]" />
    <div class="ui-alert__body">
      @if (title()) {
        <p class="ui-alert__title">{{ title() }}</p>
      }
      <ng-content />
      <div class="ui-alert__actions">
        <ng-content select="[ui-alert-actions]" />
      </div>
    </div>
    @if (dismissible()) {
      <button
        ui-button
        variant="ghost"
        type="button"
        class="ui-alert__close"
        [attr.aria-label]="closeLabelText()"
        (click)="dismiss.emit()"
      >
        <ui-icon name="x" size="sm" />
      </button>
    }
  `,
})
export class AlertComponent {
  private readonly uiLabels = inject(UI_LABELS);
  protected readonly toneIcons = TONE_ICONS;
  readonly tone = input<AlertTone>('info');
  readonly title = input<string>();
  /** Shows a close button; remove the alert on `(dismiss)`. */
  readonly dismissible = input(false);
  /** Accessible name of the close button; pass the translated text. */
  readonly closeLabel = input<string>();
  protected readonly closeLabelText = computed(
    () => this.closeLabel() ?? this.uiLabels().dismiss,
  );
  readonly dismiss = output();

  protected readonly classes = computed(
    () => `ui-alert ui-alert--${this.tone()}`,
  );
}
