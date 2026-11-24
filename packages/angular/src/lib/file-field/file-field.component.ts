import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { UI_LABELS } from '../labels';

let nextId = 0;

/**
 * The native file input with a label, hint and error, in a zone that also takes files
 * dropped on it. The browser's own button and file names stay, so it works with the
 * keyboard, screen readers and phones as usual. The value is a `File[]`.
 *
 * `accept` limits the picker, not a drop, so check the type and size again on the server.
 *
 * ```html
 * <ui-file-field label="Invoice" accept=".pdf" formControlName="invoice" />
 * ```
 */
@Component({
  selector: 'ui-file-field',
  host: {
    class: 'ui-field',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <div
      class="ui-dropzone"
      [class.ui-dropzone--over]="over()"
      (dragover)="dragOver($event)"
      (dragleave)="over.set(false)"
      (drop)="drop($event)"
    >
      <input
        #field
        type="file"
        class="ui-file"
        [id]="id"
        [attr.accept]="accept() ?? null"
        [multiple]="multiple()"
        [disabled]="disabled()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [attr.data-testid]="testId()"
        (change)="emit()"
        (blur)="markTouched()"
      />
      @if (!disabled()) {
        <p class="ui-dropzone__text">{{ dropTextText() }}</p>
      }
    </div>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    @if (error()) {
      <p class="ui-field__error" [id]="id + '-error'" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class FileFieldComponent
  implements ControlValueAccessor, FormValueControl<File[]>
{
  private readonly uiLabels = inject(UI_LABELS);
  readonly label = input.required<string>();
  /** File types the picker offers: `'.pdf'`, `'image/*'`. */
  readonly accept = input<string>();
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly hint = input<string>();
  readonly error = input<string>();
  /** The line under the button; pass the translated text. */
  readonly dropText = input<string>();
  protected readonly dropTextText = computed(
    () => this.dropText() ?? this.uiLabels().dropFile,
  );
  readonly testId = input<string>();

  protected readonly id = `ui-file-field-${nextId++}`;
  protected readonly over = signal(false);
  readonly value = model<File[]>([]);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );
  // Not required: a form control writes its first value before the view exists.
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  private onChange: (files: File[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    afterRenderEffect(() => {
      if (!this.value().length) {
        const input = this.field()?.nativeElement;
        if (input) input.value = '';
      }
    });
  }

  protected dragOver(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.over.set(true);
  }

  /** A drop fills the input itself, so the browser shows the names and a form sends the files. */
  protected drop(event: DragEvent): void {
    event.preventDefault();
    this.over.set(false);
    const files = event.dataTransfer?.files;
    const input = this.field()?.nativeElement;
    if (this.disabled() || !files?.length || !input) return;
    if (this.multiple() || files.length === 1) input.files = files;
    else {
      const one = new DataTransfer();
      one.items.add(files[0]);
      input.files = one.files;
    }
    this.emit();
  }

  protected emit(): void {
    const value = Array.from(this.field()?.nativeElement.files ?? []);
    this.value.set(value);
    this.onChange(value);
  }

  /** Only clearing can be written: browsers never let a page pick files for the reader. */
  writeValue(files: File[] | null): void {
    this.value.set(files ?? []);
    const input = this.field()?.nativeElement;
    if (input && !files?.length) input.value = '';
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
