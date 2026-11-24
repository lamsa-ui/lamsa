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
import { TagComponent } from '../tag/tag.component';
import { UI_LABELS } from '../labels';

let nextId = 0;

/**
 * A text field that collects several short values, such as toppings or email addresses.
 * Enter or a comma adds the text as a tag; Backspace in the empty field moves to the last
 * tag's × button. After a tag goes, focus moves to the next one, or back to the field, and
 * screen readers hear "Cheese removed". The value is a string[].
 *
 * ```html
 * <ui-chip-input label="Toppings" hint="Press Enter after each one." formControlName="toppings" />
 * ```
 */
@Component({
  selector: 'ui-chip-input',
  host: { class: 'ui-field' },
  imports: [TagComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <div class="ui-chips" #box>
      <ul class="ui-chips__list" [attr.aria-label]="label()">
        @for (chip of chips(); track chip; let i = $index) {
          <li>
            <ui-tag
              [removable]="!disabled()"
              [removeLabel]="removeLabelText()"
              (remove)="remove(i)"
              >{{ chip }}</ui-tag
            >
          </li>
        }
      </ul>
      <input
        #field
        class="ui-chips__input"
        type="text"
        enterkeyhint="enter"
        [id]="id"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-describedby]="hint() ? id + '-hint' : null"
        [attr.data-testid]="testId()"
        (keydown)="keydown($event)"
        (blur)="markTouched()"
      />
    </div>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    <span class="ui-visually-hidden" aria-live="polite">{{ said() }}</span>
  `,
})
export class ChipInputComponent
  implements ControlValueAccessor, FormValueControl<string[]>
{
  private readonly uiLabels = inject(UI_LABELS);
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly placeholder = input('');
  /** First word of each tag's × button. Translate it. */
  readonly removeLabel = input<string>();
  protected readonly removeLabelText = computed(
    () => this.removeLabel() ?? this.uiLabels().remove,
  );
  /** What screen readers hear after a change. Translate them. */
  readonly addedLabel = input<(chip: string) => string>();
  protected readonly addedLabelText = computed(
    () => this.addedLabel() ?? this.uiLabels().added,
  );
  readonly removedLabel = input<(chip: string) => string>();
  protected readonly removedLabelText = computed(
    () => this.removedLabel() ?? this.uiLabels().removed,
  );
  readonly testId = input<string>();

  protected readonly id = `ui-chip-input-${nextId++}`;
  readonly value = model<string[]>([]);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly said = signal('');
  private readonly field =
    viewChild.required<ElementRef<HTMLInputElement>>('field');
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');
  private readonly injector = inject(Injector);

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get chips() {
    return this.value;
  }

  protected keydown(event: KeyboardEvent): void {
    const field = event.target as HTMLInputElement;
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.add(field.value);
      field.value = '';
    } else if (event.key === 'Backspace' && !field.value) {
      this.buttons().pop()?.focus();
    }
  }

  protected remove(index: number): void {
    const chip = this.chips()[index];
    this.set(this.chips().filter((_, i) => i !== index));
    this.said.set(this.removedLabelText()(chip));
    // Once the tag is gone: the one now at this index, else the one before, else the field.
    afterNextRender(
      () => {
        const buttons = this.buttons();
        (
          buttons[Math.min(index, buttons.length - 1)] ??
          this.field().nativeElement
        ).focus();
      },
      { injector: this.injector },
    );
  }

  private add(text: string): void {
    const chip = text.trim();
    if (!chip || this.chips().includes(chip)) return;
    this.set([...this.chips(), chip]);
    this.said.set(this.addedLabelText()(chip));
  }

  private set(chips: string[]): void {
    this.value.set(chips);
    this.onChange(chips);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  private buttons(): HTMLElement[] {
    return Array.from(
      this.box().nativeElement.querySelectorAll<HTMLElement>('.ui-tag__remove'),
    );
  }

  writeValue(value: string[] | null): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
