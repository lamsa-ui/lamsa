import type { IconName } from '@ghazal-ui/icons';
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  ref,
  useId,
  nextTick,
  watch,
  type PropType,
  type Ref,
} from 'vue';
import { Icon } from './content.js';
import { useUiLabels } from './labels';

/** v-model that also works without a binding: the component keeps its own copy. */
function model<T>(
  read: () => T,
  emit: (value: T) => void,
): { value: Ref<T>; set: (next: T) => void } {
  const value = ref(read()) as Ref<T>;
  watch(read, (next) => {
    if (next !== undefined) value.value = next;
  });
  return {
    value,
    set(next: T) {
      value.value = next;
      emit(next);
    },
  };
}

function message(kind: 'hint' | 'error', id: string, text?: string) {
  return text
    ? [
        h(
          'p',
          {
            class: `ui-field__${kind}`,
            id: `${id}-${kind}`,
            ...(kind === 'error' ? { role: 'alert' } : {}),
          },
          text,
        ),
      ]
    : [];
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
  undefined;

export interface FieldsetProps {
  legend: string;
  hint?: string;
}

/** Groups related fields under one legend, such as the parts of an address. */
export const Fieldset = defineComponent({
  name: 'UiFieldset',
  inheritAttrs: false,
  props: { legend: { type: String, required: true }, hint: String },
  setup(props, { attrs, slots }) {
    const id = useId();
    return () =>
      h(
        'fieldset',
        mergeProps(attrs, {
          class: 'ui-fieldset',
          'aria-describedby': props.hint ? `${id}-hint` : undefined,
        }),
        [
          h('legend', { class: 'ui-fieldset__legend' }, props.legend),
          ...message('hint', id, props.hint),
          slots.default?.(),
        ],
      );
  },
});

export interface FileFieldProps {
  label: string;
  hint?: string;
  error?: string;
  /** The line under the button; hidden while disabled. */
  dropText?: string;
  testId?: string;
}

/** A file input with a drop area. `@files` gets the chosen files, from the picker or a drop. */
export const FileField = defineComponent({
  name: 'UiFileField',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    hint: String,
    error: String,
    dropText: String,
    testId: String,
    id: String,
  },
  emits: {
    files: (_files: File[]) => true,
    change: (_event: Event) => true,
  },
  setup(props, { attrs, emit }) {
    const uiLabels = useUiLabels();
    const autoId = useId();
    const over = ref(false);
    const field = ref<HTMLInputElement>();
    const disabled = () =>
      attrs['disabled'] !== undefined && attrs['disabled'] !== false;

    function drop(event: DragEvent) {
      event.preventDefault();
      over.value = false;
      const files = event.dataTransfer?.files;
      if (disabled() || !files?.length || !field.value) return;
      if (attrs['multiple'] !== undefined || files.length === 1)
        field.value.files = files;
      else {
        const one = new DataTransfer();
        one.items.add(files[0]);
        field.value.files = one.files;
      }
      emit('files', Array.from(field.value.files ?? []));
    }

    return () => {
      const id = props.id ?? autoId;
      return h(
        'div',
        { class: ['ui-field', props.error && 'ui-field--invalid'] },
        [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h(
            'div',
            {
              class: ['ui-dropzone', over.value && 'ui-dropzone--over'],
              onDragover: (event: DragEvent) => {
                if (disabled()) return;
                event.preventDefault();
                over.value = true;
              },
              onDragleave: () => (over.value = false),
              onDrop: drop,
            },
            [
              h(
                'input',
                mergeProps(attrs, {
                  ref: field,
                  type: 'file',
                  class: 'ui-file',
                  id,
                  'aria-invalid': props.error ? 'true' : undefined,
                  'aria-describedby': describedBy(id, props.hint, props.error),
                  'data-testid': props.testId,
                  onChange: (event: Event) => {
                    emit('change', event);
                    emit(
                      'files',
                      Array.from(
                        (event.target as HTMLInputElement).files ?? [],
                      ),
                    );
                  },
                }),
              ),
              disabled()
                ? null
                : h(
                    'p',
                    { class: 'ui-dropzone__text' },
                    props.dropText ?? uiLabels.value.dropFile,
                  ),
            ],
          ),
          ...message('hint', id, props.hint),
          ...message('error', id, props.error),
        ],
      );
    };
  },
});

export interface SliderProps {
  modelValue?: number;
  label: string;
  hint?: string;
  min?: number;
  max?: number;
  /** Turns the value into words for the label and screen readers: "EGP 500". */
  format?: (value: number) => string;
  testId?: string;
}

/** A native range input with its value shown beside the label. */
export const Slider = defineComponent({
  name: 'UiSlider',
  inheritAttrs: false,
  props: {
    modelValue: Number,
    label: { type: String, required: true },
    hint: String,
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: Number,
    format: Function as PropType<(value: number) => string>,
    testId: String,
    id: String,
  },
  emits: { 'update:modelValue': (_value: number) => true },
  setup(props, { attrs, emit }) {
    const autoId = useId();
    const current = model(
      () => props.modelValue ?? props.min,
      (v) => emit('update:modelValue', v),
    );
    return () => {
      const id = props.id ?? autoId;
      const value = current.value.value;
      const text = props.format?.(value) ?? String(value);
      const fill = `${((value - props.min) / (props.max - props.min || 1)) * 100}%`;
      return h('div', { class: 'ui-field' }, [
        h('div', { class: 'ui-slider__head' }, [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h(
            'output',
            { class: 'ui-slider__value', for: id, 'aria-hidden': 'true' },
            text,
          ),
        ]),
        h(
          'input',
          mergeProps(attrs, {
            type: 'range',
            class: 'ui-slider',
            id,
            min: props.min,
            max: props.max,
            step: props.step,
            value,
            style: { '--ui-slider-fill': fill },
            'aria-valuetext': props.format ? text : undefined,
            'aria-describedby': props.hint ? `${id}-hint` : undefined,
            'data-testid': props.testId,
            onInput: (event: Event) =>
              current.set(Number((event.target as HTMLInputElement).value)),
          }),
        ),
        ...message('hint', id, props.hint),
      ]);
    };
  },
});

export interface RatingProps {
  modelValue?: number | null;
  label?: string;
  max?: number;
  /** Shows a score as stars, for reading only. */
  readOnly?: boolean;
  disabled?: boolean;
  name?: string;
  starLabel?: (stars: number) => string;
  scoreLabel?: (value: number, max: number) => string;
}

/** Stars to give a score (radios underneath) or, with `readOnly`, to show one. */
export const Rating = defineComponent({
  name: 'UiRating',
  inheritAttrs: false,
  props: {
    modelValue: { type: Number as PropType<number | null>, default: null },
    label: { type: String, default: '' },
    max: { type: Number, default: 5 },
    readOnly: Boolean,
    disabled: Boolean,
    name: String,
    starLabel: Function as PropType<(stars: number) => string>,
    scoreLabel: Function as PropType<(value: number, max: number) => string>,
  },
  emits: {
    'update:modelValue': (_value: number) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const uiLabels = useUiLabels();
    const autoName = useId();
    const current = model<number | null>(
      () => props.modelValue,
      (v) => v !== null && emit('update:modelValue', v),
    );
    const stars = computed(() =>
      Array.from({ length: props.max }, (_, i) => i + 1),
    );
    const star = () => h(Icon, { name: 'star' });
    return () => {
      const value = current.value.value;
      if (props.readOnly) {
        const rounded = Math.round(value ?? 0);
        return h(
          'span',
          mergeProps(attrs, {
            class: 'ui-rating ui-rating--readonly',
            role: 'img',
            'aria-label': (props.scoreLabel ?? uiLabels.value.score)(
              value ?? 0,
              props.max,
            ),
          }),
          h(
            'span',
            { class: 'ui-rating__stars' },
            stars.value.map((n) =>
              h(
                'span',
                {
                  key: n,
                  class: [
                    'ui-rating__star',
                    n <= rounded && 'ui-rating__star--on',
                  ],
                },
                star(),
              ),
            ),
          ),
        );
      }
      return h(
        'fieldset',
        mergeProps(attrs, { class: 'ui-rating', disabled: props.disabled }),
        [
          h('legend', { class: 'ui-field__label' }, props.label),
          h(
            'span',
            { class: 'ui-rating__stars' },
            stars.value.map((n) =>
              h('label', { key: n, class: 'ui-rating__star' }, [
                h('input', {
                  type: 'radio',
                  class: 'ui-visually-hidden',
                  name: props.name ?? autoName,
                  value: n,
                  checked: n === value,
                  onChange: () => current.set(n),
                  onBlur: (event: FocusEvent) => emit('blur', event),
                }),
                star(),
                h(
                  'span',
                  { class: 'ui-visually-hidden' },
                  (props.starLabel ?? uiLabels.value.star)(n),
                ),
              ]),
            ),
          ),
        ],
      );
    };
  },
});

export interface SegmentOption {
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  modelValue?: string | null;
  label: string;
  options: readonly SegmentOption[];
  /** Shows only the icons; the labels stay for screen readers. */
  iconOnly?: boolean;
  /** Stretches to the full width. */
  block?: boolean;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** Two to five choices side by side; one is always picked. Radios underneath. */
export const SegmentedControl = defineComponent({
  name: 'UiSegmentedControl',
  inheritAttrs: false,
  props: {
    modelValue: { type: String as PropType<string | null>, default: null },
    label: { type: String, required: true },
    options: {
      type: Array as PropType<readonly SegmentOption[]>,
      required: true,
    },
    iconOnly: Boolean,
    block: Boolean,
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const id = useId();
    const current = model<string | null>(
      () => props.modelValue,
      (v) => v !== null && emit('update:modelValue', v),
    );
    return () =>
      h(
        'div',
        mergeProps(attrs, {
          role: 'radiogroup',
          'aria-label': props.label,
          class: ['ui-segmented', props.block && 'ui-segmented--block'],
        }),
        props.options.map((option, index) =>
          h('label', { class: 'ui-segmented__option', key: option.value }, [
            h('input', {
              type: 'radio',
              name: props.name ?? id,
              value: option.value,
              checked: current.value.value === option.value,
              disabled: props.disabled || option.disabled,
              'data-testid': props.testId
                ? `${props.testId}-${index}`
                : undefined,
              onChange: () => current.set(option.value),
              onBlur: (event: FocusEvent) => emit('blur', event),
            }),
            option.icon ? h(Icon, { name: option.icon }) : null,
            h(
              'span',
              {
                class:
                  props.iconOnly && option.icon
                    ? 'ui-visually-hidden'
                    : undefined,
              },
              option.label,
            ),
          ]),
        ),
      );
  },
});

/** Arabic-Indic and Persian digits to Latin, so «١٢٣» types as 123. */
export function latinDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export interface PinInputProps {
  modelValue?: string;
  label: string;
  length?: number;
  /** Hides the digits as they are typed. */
  secret?: boolean;
  cellLabel?: (n: number, of: number) => string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** One box per digit for a one-time code. Pasting fills them all; Arabic digits count. */
export const PinInput = defineComponent({
  name: 'UiPinInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    length: { type: Number, default: 6 },
    secret: Boolean,
    cellLabel: Function as PropType<(n: number, of: number) => string>,
    hint: String,
    error: String,
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_code: string) => true,
    complete: (_code: string) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const cells = (code: string) =>
      Array.from({ length: props.length }, (_, i) => code[i] ?? '');
    const digits = ref(cells(props.modelValue));
    watch(
      () => props.modelValue,
      (code) => (digits.value = cells(code)),
    );
    const inputs: HTMLInputElement[] = [];
    const focus = (i: number) =>
      inputs[Math.max(0, Math.min(props.length - 1, i))]?.focus();
    const set = (next: string[]) => {
      digits.value = next;
      const code = next.join('');
      emit('update:modelValue', code);
      if (next.every(Boolean)) emit('complete', code);
    };

    return () =>
      h(
        'div',
        mergeProps(attrs, {
          class: ['ui-field ui-pin-input', props.error && 'ui-field--invalid'],
        }),
        [
          h(
            'span',
            { class: 'ui-field__label', id: `${id}-label` },
            props.label,
          ),
          h(
            'div',
            {
              class: 'ui-pin',
              role: 'group',
              'aria-labelledby': `${id}-label`,
              'aria-describedby': describedBy(id, props.hint, props.error),
            },
            digits.value.map((digit, index) =>
              h('input', {
                key: index,
                ref: (el: unknown) => {
                  if (el) inputs[index] = el as HTMLInputElement;
                },
                class: 'ui-input ui-pin__cell',
                type: props.secret ? 'password' : 'text',
                inputmode: 'numeric',
                placeholder: ' ',
                autocomplete: index === 0 ? 'one-time-code' : 'off',
                'aria-label': (props.cellLabel ?? uiLabels.value.digit)(
                  index + 1,
                  props.length,
                ),
                'aria-invalid': props.error ? 'true' : undefined,
                'data-testid': props.testId
                  ? `${props.testId}-${index}`
                  : undefined,
                value: digit,
                disabled: props.disabled,
                onBlur: (event: FocusEvent) => emit('blur', event),
                onFocus: (event: FocusEvent) =>
                  (event.target as HTMLInputElement).select(),
                onInput: (event: Event) => {
                  const target = event.target as HTMLInputElement;
                  const typed = latinDigits(target.value).replace(/\D/g, '');
                  const next = [...digits.value];
                  if (!typed) next[index] = '';
                  [...typed].slice(0, props.length - index).forEach((d, i) => {
                    next[index + i] = d;
                  });
                  // Keep the box showing only its own digit.
                  target.value = next[index];
                  set(next);
                  if (typed) focus(index + typed.length);
                },
                onKeydown: (event: KeyboardEvent) => {
                  const go = (i: number) => {
                    event.preventDefault();
                    focus(i);
                  };
                  if (event.key === 'ArrowLeft') go(index - 1);
                  else if (event.key === 'ArrowRight') go(index + 1);
                  else if (event.key === 'Home') go(0);
                  else if (event.key === 'End') go(props.length - 1);
                  else if (event.key === 'Backspace' && !digit && index > 0) {
                    const next = [...digits.value];
                    next[index - 1] = '';
                    set(next);
                    go(index - 1);
                  }
                },
              }),
            ),
          ),
          props.name
            ? h('input', {
                type: 'hidden',
                name: props.name,
                value: digits.value.join(''),
              })
            : null,
          ...message('hint', id, props.hint),
          ...message('error', id, props.error),
        ],
      );
  },
});

export interface StepItem {
  label: string;
  /** False keeps a linear stepper on this step. Defaults to true. */
  completed?: boolean;
}

export interface StepperProps {
  modelValue?: number;
  label: string;
  steps: readonly StepItem[];
  /** Later steps open only once every earlier one is completed. */
  linear?: boolean;
  doneLabel?: string;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  /** The number in each marker, such as Arabic-Indic digits. */
  number?: (n: number) => string;
}

/**
 * A task in a few steps, one panel at a time. The `#panel` slot gets `{ index, step }`
 * and renders that step's content; hidden steps stay mounted.
 */
export const Stepper = defineComponent({
  name: 'UiStepper',
  inheritAttrs: false,
  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String, required: true },
    steps: { type: Array as PropType<readonly StepItem[]>, required: true },
    linear: Boolean,
    doneLabel: String,
    backLabel: String,
    nextLabel: String,
    finishLabel: String,
    number: {
      type: Function as PropType<(n: number) => string>,
      default: String,
    },
  },
  emits: {
    'update:modelValue': (_index: number) => true,
    finish: () => true,
    blocked: (_index: number) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const current = model(
      () => props.modelValue,
      (i) => emit('update:modelValue', i),
    );
    const panels: HTMLElement[] = [];
    const completed = (i: number) => props.steps[i]?.completed ?? true;
    const reachable = (i: number) =>
      !props.linear || props.steps.slice(0, i).every((_, j) => completed(j));
    const go = (i: number) => {
      if (i === current.value.value) return;
      current.set(i);
      // Move focus to the new panel once it is shown.
      void nextTick(() => panels[i]?.focus());
    };
    const next = () => {
      const at = current.value.value;
      if (props.linear && !completed(at)) emit('blocked', at);
      else if (at === props.steps.length - 1) emit('finish');
      else go(at + 1);
    };

    return () => {
      const at = current.value.value;
      return h('div', mergeProps(attrs, { class: 'ui-stepper' }), [
        h(
          'ol',
          { class: 'ui-steps', 'aria-label': props.label },
          props.steps.map((step, i) => {
            const done = i < at && completed(i);
            return h(
              'li',
              {
                key: i,
                class: [
                  'ui-steps__item',
                  done && 'ui-steps__item--done',
                  i === at && 'ui-steps__item--current',
                ],
              },
              h(
                'button',
                {
                  type: 'button',
                  class: 'ui-steps__step',
                  id: `${id}-step-${i}`,
                  'aria-current': i === at ? 'step' : undefined,
                  disabled: !reachable(i),
                  onClick: () => go(i),
                },
                [
                  h(
                    'span',
                    { class: 'ui-steps__marker', 'aria-hidden': 'true' },
                    done ? [h(Icon, { name: 'check' })] : props.number(i + 1),
                  ),
                  h('span', { class: 'ui-steps__label' }, [
                    done
                      ? h(
                          'span',
                          { class: 'ui-visually-hidden' },
                          `${props.doneLabel ?? uiLabels.value.stepDone}: `,
                        )
                      : null,
                    step.label,
                  ]),
                ],
              ),
            );
          }),
        ),
        ...props.steps.map((step, i) =>
          h(
            'section',
            {
              key: i,
              ref: (el: unknown) => {
                if (el) panels[i] = el as HTMLElement;
              },
              class: 'ui-stepper__panel',
              tabindex: -1,
              'aria-labelledby': `${id}-step-${i}`,
              hidden: i !== at,
            },
            // Every step stays mounted while hidden, so what was typed is kept.
            slots.panel?.({ index: i, step }),
          ),
        ),
        h('div', { class: 'ui-stepper__actions' }, [
          at > 0
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'ui-button ui-button--secondary ui-button--md',
                  onClick: () => go(at - 1),
                },
                props.backLabel ?? uiLabels.value.stepBack,
              )
            : null,
          h(
            'button',
            {
              type: 'button',
              class: 'ui-button ui-button--primary ui-button--md',
              onClick: next,
            },
            at === props.steps.length - 1
              ? (props.finishLabel ?? uiLabels.value.stepFinish)
              : (props.nextLabel ?? uiLabels.value.stepNext),
          ),
        ]),
      ]);
    };
  },
});
