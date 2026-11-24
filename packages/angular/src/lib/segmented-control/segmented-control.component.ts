import {
  booleanAttribute,
  Component,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import type { IconName } from '@ghazal-ui/icons';
import { IconComponent } from '../icon/icon.component';

let nextId = 0;

/** One segment: its value, its words, and an icon to show beside them (or instead, with iconOnly). */
export interface SegmentOption<T> {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

/**
 * One choice from two to five short options side by side, such as a view (List, Grid) or a
 * period (Day, Week, Month). Native radios: Tab reaches the group, arrow keys move the choice.
 * The chosen segment sits on a raised tile with an edge, so colour is never the only sign.
 * For a choice with longer words, or more than five, use `ui-radio-group` or `ui-select`.
 *
 * ```html
 * <ui-segmented-control label="View" [options]="views" formControlName="view" />
 * <ui-segmented-control label="View" [options]="views" iconOnly [(ngModel)]="view" />
 * ```
 */
@Component({
  selector: 'ui-segmented-control',
  imports: [IconComponent],
  host: {
    class: 'ui-segmented',
    role: 'radiogroup',
    '[class.ui-segmented--block]': 'block()',
    '[attr.aria-label]': 'label()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedControlComponent),
      multi: true,
    },
  ],
  template: `
    @for (option of options(); track option.value) {
      <label class="ui-segmented__option">
        <input
          type="radio"
          [name]="id"
          [checked]="isChecked(option.value)"
          [disabled]="disabled() || !!option.disabled"
          [attr.data-testid]="testId() ? testId() + '-' + $index : null"
          (change)="pick(option.value)"
          (blur)="markTouched()"
        />
        @if (option.icon) {
          <ui-icon [name]="option.icon" />
        }
        <span [class.ui-visually-hidden]="iconOnly() && !!option.icon">{{
          option.label
        }}</span>
      </label>
    }
  `,
})
export class SegmentedControlComponent<T>
  implements ControlValueAccessor, FormValueControl<T | null>
{
  /** Names the group for screen readers: "View". */
  readonly label = input.required<string>();
  readonly options = input.required<readonly SegmentOption<T>[]>();
  /** Shows only the icons; the words stay for screen readers. */
  readonly iconOnly = input(false, { transform: booleanAttribute });
  /** Fills the width, segments sharing it equally. */
  readonly block = input(false, { transform: booleanAttribute });
  /** data-testid prefix; each radio gets -<index>. */
  readonly testId = input<string>();
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  protected readonly id = `ui-segmented-${nextId++}`;
  readonly value = model<T | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected isChecked(value: T): boolean {
    const current = this.value();
    return current !== null && this.compareWith()(value, current);
  }

  protected pick(value: T): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
