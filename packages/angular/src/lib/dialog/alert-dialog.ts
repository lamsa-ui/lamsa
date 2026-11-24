import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ButtonComponent,
  type ButtonVariant,
} from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { TONE_ICONS } from '../alert/tone-icon';
import { DialogCloseDirective, DialogComponent, UiDialog } from './dialog';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertAction<R> {
  /** The translated text of the button. */
  label: string;
  /** What `alert()` resolves to when this button is pressed. */
  value: R;
  variant?: ButtonVariant;
  /** Focus starts here. Without it, focus starts on the first non-danger action. */
  initialFocus?: boolean;
}

export interface AlertOptions<R> {
  title: string;
  /** What happened or what will happen; read with the title. Plain text. */
  message: string;
  /** Shown as an icon; the title must say it in words too. */
  tone?: AlertTone;
  /** One to three buttons, in reading order. */
  actions: readonly AlertAction<R>[];
}

export interface ConfirmOptions {
  title: string;
  message: string;
  /** The translated text of the confirm button. */
  confirmLabel: string;
  /** The translated text of the cancel button. */
  cancelLabel?: string;
  /** For actions that destroy something: danger tone and button, and focus starts on Cancel. */
  danger?: boolean;
}

/** The content of an alert dialog: tone icon, title, message and actions, centred. */
@Component({
  selector: 'ui-alert-dialog',
  imports: [
    IconComponent,
    DialogComponent,
    ButtonComponent,
    DialogCloseDirective,
  ],
  template: `
    <ui-dialog
      [title]="options.title"
      [description]="options.message"
      size="sm"
      variant="alert"
    >
      @if (options.tone; as tone) {
        <span
          ui-dialog-icon
          class="ui-dialog__icon ui-dialog__icon--{{ tone }}"
          aria-hidden="true"
        >
          <ui-icon [name]="toneIcons[tone]" />
        </span>
      }
      <div ui-dialog-actions>
        @for (action of options.actions; track $index) {
          <button
            ui-button
            type="button"
            [variant]="action.variant ?? 'secondary'"
            [attr.data-ui-initial-focus]="$index === focusIndex() ? '' : null"
            [attr.data-testid]="'ui-alert-action-' + $index"
            [uiDialogClose]="action.value"
          >
            {{ action.label }}
          </button>
        }
      </div>
    </ui-dialog>
  `,
})
export class AlertDialogComponent<R> {
  protected readonly toneIcons = TONE_ICONS;
  protected readonly options = inject<AlertOptions<R>>(DIALOG_DATA);
  protected readonly focusIndex = computed(() => {
    const actions = this.options.actions;
    const marked = actions.findIndex((a) => a.initialFocus);
    if (marked !== -1) return marked;
    const safe = actions.findIndex((a) => a.variant !== 'danger');
    return safe === -1 ? 0 : safe;
  });
}

/**
 * Alert dialogs: a message that needs an answer. `role="alertdialog"`, only its
 * buttons answer (never Escape or a click outside), and focus starts on the safest button.
 *
 * ```ts
 * const choice = await inject(UiAlertDialog).alert({
 *   title: 'Unsaved changes', message: 'Save them before you leave?', tone: 'warning',
 *   actions: [
 *     { label: 'Discard', value: 'discard', variant: 'danger' },
 *     { label: 'Save', value: 'save', variant: 'primary' },
 *   ],
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UiAlertDialog {
  private readonly dialog = inject(UiDialog);

  /** Resolves with the value of the pressed action; `undefined` only if the app closes it. */
  alert<R>(options: AlertOptions<R>): Promise<R | undefined> {
    const ref = this.dialog.open<R, AlertOptions<R>>(AlertDialogComponent, {
      data: options,
      role: 'alertdialog',
      initialFocus: '[data-ui-initial-focus]',
    });
    return firstValueFrom(ref.closed);
  }

  /** Resolves `true` only when the confirm button is pressed. */
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const answer = await this.alert<boolean>({
      title: options.title,
      message: options.message,
      tone: options.danger ? 'danger' : undefined,
      actions: [
        {
          label: options.cancelLabel ?? 'Cancel',
          value: false,
          variant: 'secondary',
        },
        {
          label: options.confirmLabel,
          value: true,
          variant: options.danger ? 'danger' : 'primary',
          initialFocus: !options.danger,
        },
      ],
    });
    return answer === true;
  }
}
