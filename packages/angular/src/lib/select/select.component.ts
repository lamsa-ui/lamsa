import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon.component';

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

let nextId = 0;

/**
 * A single-choice select built on the CDK listbox, so options get arrow keys,
 * Home/End, typeahead and the listbox ARIA roles. Use it like any form control.
 *
 * ```html
 * <ui-select label="City" [options]="cities" formControlName="city" />
 * ```
 */
@Component({
  selector: 'ui-select',
  host: { class: 'ui-field' },
  imports: [
    IconComponent,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    CdkListbox,
    CdkOption,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <span class="ui-field__label" [id]="id + '-label'">{{ label() }}</span>
    <button
      #trigger
      type="button"
      class="ui-select__trigger"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [id]="id"
      [disabled]="disabled()"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open()"
      [attr.aria-labelledby]="id + '-label ' + id"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="error() ? id + '-error' : null"
      [attr.data-testid]="testId()"
      (click)="open() ? close() : show()"
      (keydown.arrowdown)="show($event)"
      (keydown.arrowup)="show($event)"
    >
      @if (selected(); as option) {
        <span>{{ option.label }}</span>
      } @else {
        <span class="ui-select__placeholder">{{ placeholder() }}</span>
      }
      <ui-icon name="chevron-down" class="ui-select__chevron" />
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayMatchWidth]="true"
      cdkConnectedOverlayUsePopover="inline"
      (overlayOutsideClick)="outsideClick($event)"
      (overlayKeydown)="keydown($event)"
      (detach)="open.set(false)"
    >
      <ul
        class="ui-listbox"
        cdkListbox
        [cdkListboxValue]="listboxValue()"
        [cdkListboxCompareWith]="compareWith()"
        [attr.aria-labelledby]="id + '-label'"
        (cdkListboxValueChange)="pick($event.value)"
      >
        @for (option of options(); track option.value) {
          <li
            #opt="cdkOption"
            class="ui-option"
            [class.ui-option--active]="opt.isActive()"
            [cdkOption]="option.value"
            [cdkOptionDisabled]="!!option.disabled"
            [attr.data-testid]="
              testId() ? testId() + '-option-' + $index : null
            "
          >
            {{ option.label }}
          </li>
        }
      </ul>
    </ng-template>
    @if (error()) {
      <p class="ui-field__error" [id]="id + '-error'" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class SelectComponent<T>
  implements ControlValueAccessor, FormValueControl<T | null>
{
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly placeholder = input('');
  readonly error = input<string>();
  readonly testId = input<string>();
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  protected readonly id = `ui-select-${nextId++}`;
  protected readonly open = signal(false);
  readonly value = model<T | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly selected = computed(() => {
    const value = this.value();
    return value === null
      ? undefined
      : this.options().find((option) =>
          this.compareWith()(option.value, value),
        );
  });
  protected readonly listboxValue = computed(() => {
    const value = this.value();
    return value === null ? [] : [value];
  });

  private readonly injector = inject(Injector);
  private readonly trigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly listbox = viewChild(CdkListbox);
  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected show(event?: Event): void {
    event?.preventDefault();
    this.open.set(true);
    afterNextRender(() => this.listbox()?.focus(), { injector: this.injector });
  }

  protected close(returnFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.markTouched();
    if (returnFocus) this.trigger().nativeElement.focus();
  }

  protected pick(values: readonly T[]): void {
    if (values.length) {
      this.value.set(values[0]);
      this.onChange(values[0]);
    }
    this.close();
  }

  private markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  protected keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      this.close();
    }
  }

  protected outsideClick(event: MouseEvent): void {
    // The trigger's own click handler toggles the list, so ignore clicks on it here.
    if (!this.trigger().nativeElement.contains(event.target as Node))
      this.close(false);
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
