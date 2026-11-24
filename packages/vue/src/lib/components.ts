import { type IconName } from '@lamsa-ui/icons';
import { Icon } from './content.js';
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  ref,
  useId,
  watch,
  type PropType,
  type VNodeChild,
} from 'vue';
import { useUiLabels } from './labels';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline'
  | 'soft'
  | 'link'
  | 'success'
  | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';
type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
}

export interface BadgeProps {
  variant?: BadgeVariant;
}

export interface CardProps {
  title?: string;
  level?: 2 | 3 | 4;
  padding?: 'md' | 'lg';
}

export interface TextFieldProps {
  modelValue?: string | number;
  label: string;
  type?: FieldType;
  hint?: string;
  error?: string;
  id?: string;
  testId?: string;
}

export interface TextareaProps {
  modelValue?: string;
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  testId?: string;
  rows?: number;
}

export interface CheckboxProps {
  modelValue?: boolean;
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  testId?: string;
}

export interface SwitchProps {
  modelValue?: boolean;
  label: string;
  hint?: string;
  id?: string;
  testId?: string;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  modelValue?: string;
  label: string;
  options: readonly RadioGroupOption[];
  hint?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  testId?: string;
}

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  role?: 'alert' | 'status';
}

export interface SpinnerProps {
  label?: string;
  showLabel?: boolean;
  size?: 'md' | 'lg';
}

export interface ProgressProps {
  label: string;
  value?: number | null;
  max?: number;
  valueText?: string;
  testId?: string;
}

export interface SkeletonProps {
  shape?: 'text' | 'circle' | 'block';
  lines?: number;
}

export interface PhoneCountry {
  code: string;
  dial: string;
  name: string;
}

export interface PhoneFieldProps {
  modelValue?: string | null;
  label: string;
  country?: string;
  countries?: readonly PhoneCountry[];
  countryLabel?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { code: 'EG', dial: '+20', name: 'Egypt' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
  { code: 'AE', dial: '+971', name: 'UAE' },
  { code: 'KW', dial: '+965', name: 'Kuwait' },
  { code: 'QA', dial: '+974', name: 'Qatar' },
  { code: 'BH', dial: '+973', name: 'Bahrain' },
  { code: 'OM', dial: '+968', name: 'Oman' },
  { code: 'JO', dial: '+962', name: 'Jordan' },
  { code: 'LB', dial: '+961', name: 'Lebanon' },
  { code: 'IQ', dial: '+964', name: 'Iraq' },
  { code: 'PS', dial: '+970', name: 'Palestine' },
  { code: 'SY', dial: '+963', name: 'Syria' },
  { code: 'YE', dial: '+967', name: 'Yemen' },
  { code: 'LY', dial: '+218', name: 'Libya' },
  { code: 'SD', dial: '+249', name: 'Sudan' },
  { code: 'TN', dial: '+216', name: 'Tunisia' },
  { code: 'DZ', dial: '+213', name: 'Algeria' },
  { code: 'MA', dial: '+212', name: 'Morocco' },
  { code: 'TR', dial: '+90', name: 'Türkiye' },
  { code: 'GB', dial: '+44', name: 'UK' },
  { code: 'DE', dial: '+49', name: 'Germany' },
  { code: 'FR', dial: '+33', name: 'France' },
  { code: 'US', dial: '+1', name: 'USA' },
];

function describedBy(
  existing: unknown,
  ids: Array<string | undefined>,
): string | undefined {
  const values = [typeof existing === 'string' ? existing : undefined, ...ids]
    .filter((value): value is string => !!value)
    .join(' ');
  return values || undefined;
}

function fieldMessage(
  kind: 'hint' | 'error',
  id: string,
  text: string,
): VNodeChild {
  return h(
    'p',
    {
      class: kind === 'hint' ? 'ui-field__hint' : 'ui-field__error',
      id: `${id}-${kind}`,
      ...(kind === 'error' ? { role: 'alert' } : {}),
    },
    text,
  );
}

/** An icon slot inside a button: decoration, the label names the button. */
const icon = (children: VNodeChild) =>
  h(
    'span',
    { class: 'ui-button__icon', 'aria-hidden': 'true' },
    children as never,
  );

export const Button = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary',
    },
    size: { type: String as PropType<ButtonSize>, default: 'md' },
    loading: Boolean,
    iconOnly: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        mergeProps(attrs, {
          class: [
            'ui-button',
            `ui-button--${props.variant}`,
            `ui-button--${props.size}`,
            props.iconOnly && 'ui-button--icon',
          ],
          disabled: props.loading || attrs.disabled,
          'aria-busy': props.loading || undefined,
        }),
        [
          ...(props.loading
            ? [h('span', { class: 'ui-spinner', 'aria-hidden': 'true' })]
            : slots.startIcon
              ? [icon(slots.startIcon())]
              : []),
          ...(slots.default?.() ?? []),
          ...(slots.endIcon ? [icon(slots.endIcon())] : []),
        ],
      );
  },
});

export const Badge = defineComponent({
  name: 'UiBadge',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<BadgeVariant>,
      default: 'neutral',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'span',
        mergeProps(attrs, {
          class: ['ui-badge', `ui-badge--${props.variant}`],
        }),
        slots.default?.(),
      );
  },
});

export const Card = defineComponent({
  name: 'UiCard',
  inheritAttrs: false,
  props: {
    title: String,
    level: { type: Number as PropType<2 | 3 | 4>, default: 3 },
    padding: { type: String as PropType<'md' | 'lg'>, default: 'md' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        mergeProps(attrs, {
          class: ['ui-card', props.padding === 'lg' && 'ui-card--lg'],
        }),
        [
          ...(props.title
            ? [h(`h${props.level}`, { class: 'ui-card__title' }, props.title)]
            : []),
          ...(slots.default?.() ?? []),
        ],
      );
  },
});

export const TextField = defineComponent({
  name: 'UiTextField',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    label: { type: String, required: true },
    type: { type: String as PropType<FieldType>, default: 'text' },
    hint: String,
    error: String,
    /** Text before the value, such as a currency: "EGP". */
    prefix: String,
    /** Text after the value, such as a unit or a domain: "kg", ".com". */
    suffix: String,
    id: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    input: (_event: Event) => true,
    change: (_event: Event) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const autoId = useId();
    const id = props.id ?? autoId;

    return () => {
      const affixed = !!(props.prefix || props.suffix);
      const input = h(
        'input',
        mergeProps(attrs, {
          class: affixed ? 'ui-input-group__input' : 'ui-input',
          id,
          type: props.type,
          value: props.modelValue ?? '',
          'aria-invalid': props.error ? 'true' : attrs['aria-invalid'],
          'aria-describedby': describedBy(attrs['aria-describedby'], [
            props.prefix && `${id}-prefix`,
            props.suffix && `${id}-suffix`,
            props.hint && `${id}-hint`,
            props.error && `${id}-error`,
          ]),
          'data-testid': props.testId ?? attrs['data-testid'],
          onInput: (event: Event) => {
            const target = event.target as HTMLInputElement;
            emit('update:modelValue', target.value);
            emit('input', event);
          },
          onChange: (event: Event) => emit('change', event),
          onBlur: (event: FocusEvent) => emit('blur', event),
        }),
      );
      return h(
        'div',
        { class: ['ui-field', props.error && 'ui-field--invalid'] },
        [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          affixed
            ? h('div', { class: 'ui-input-group' }, [
                ...(props.prefix
                  ? [
                      h(
                        'span',
                        { class: 'ui-input-group__addon', id: `${id}-prefix` },
                        props.prefix,
                      ),
                    ]
                  : []),
                input,
                ...(props.suffix
                  ? [
                      h(
                        'span',
                        {
                          class:
                            'ui-input-group__addon ui-input-group__addon--end',
                          id: `${id}-suffix`,
                        },
                        props.suffix,
                      ),
                    ]
                  : []),
              ])
            : input,
          ...(props.hint ? [fieldMessage('hint', id, props.hint)] : []),
          ...(props.error ? [fieldMessage('error', id, props.error)] : []),
        ],
      );
    };
  },
});

export const Textarea = defineComponent({
  name: 'UiTextarea',
  inheritAttrs: false,
  props: {
    modelValue: String,
    label: { type: String, required: true },
    hint: String,
    error: String,
    id: String,
    testId: String,
    rows: { type: Number, default: 3 },
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    input: (_event: Event) => true,
    change: (_event: Event) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const autoId = useId();
    const id = props.id ?? autoId;

    return () =>
      h('div', { class: ['ui-field', props.error && 'ui-field--invalid'] }, [
        h('label', { class: 'ui-field__label', for: id }, props.label),
        h(
          'textarea',
          mergeProps(attrs, {
            class: 'ui-input',
            id,
            rows: props.rows,
            value: props.modelValue ?? '',
            'aria-invalid': props.error ? 'true' : attrs['aria-invalid'],
            'aria-describedby': describedBy(attrs['aria-describedby'], [
              props.hint && `${id}-hint`,
              props.error && `${id}-error`,
            ]),
            'data-testid': props.testId ?? attrs['data-testid'],
            onInput: (event: Event) => {
              emit(
                'update:modelValue',
                (event.target as HTMLTextAreaElement).value,
              );
              emit('input', event);
            },
            onChange: (event: Event) => emit('change', event),
            onBlur: (event: FocusEvent) => emit('blur', event),
          }),
        ),
        ...(props.hint ? [fieldMessage('hint', id, props.hint)] : []),
        ...(props.error ? [fieldMessage('error', id, props.error)] : []),
      ]);
  },
});

export const Checkbox = defineComponent({
  name: 'UiCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    label: { type: String, required: true },
    hint: String,
    error: String,
    /** Shows a dash for "some of these": a parent checkbox over a list. */
    indeterminate: Boolean,
    id: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: boolean) => true,
    change: (_event: Event) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const autoId = useId();
    const id = props.id ?? autoId;

    return () =>
      h('div', { class: ['ui-field', props.error && 'ui-field--invalid'] }, [
        h('label', { class: 'ui-check' }, [
          h(
            'input',
            mergeProps(attrs, {
              type: 'checkbox',
              id,
              checked: props.modelValue,
              indeterminate: props.indeterminate,
              'aria-invalid': props.error ? 'true' : attrs['aria-invalid'],
              'aria-describedby': describedBy(attrs['aria-describedby'], [
                props.hint && `${id}-hint`,
                props.error && `${id}-error`,
              ]),
              'data-testid': props.testId ?? attrs['data-testid'],
              onChange: (event: Event) => {
                emit(
                  'update:modelValue',
                  (event.target as HTMLInputElement).checked,
                );
                emit('change', event);
              },
              onBlur: (event: FocusEvent) => emit('blur', event),
            }),
          ),
          props.label,
        ]),
        ...(props.hint ? [fieldMessage('hint', id, props.hint)] : []),
        ...(props.error ? [fieldMessage('error', id, props.error)] : []),
      ]);
  },
});

export const Switch = defineComponent({
  name: 'UiSwitch',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    label: { type: String, required: true },
    hint: String,
    id: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: boolean) => true,
    change: (_event: Event) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const autoId = useId();
    const id = props.id ?? autoId;

    return () =>
      h('div', { class: 'ui-field' }, [
        h('label', { class: 'ui-switch' }, [
          props.label,
          h(
            'input',
            mergeProps(attrs, {
              type: 'checkbox',
              role: 'switch',
              class: 'ui-switch__input',
              id,
              checked: props.modelValue,
              'aria-describedby': describedBy(attrs['aria-describedby'], [
                props.hint && `${id}-hint`,
              ]),
              'data-testid': props.testId ?? attrs['data-testid'],
              onChange: (event: Event) => {
                emit(
                  'update:modelValue',
                  (event.target as HTMLInputElement).checked,
                );
                emit('change', event);
              },
              onBlur: (event: FocusEvent) => emit('blur', event),
            }),
          ),
        ]),
        ...(props.hint ? [fieldMessage('hint', id, props.hint)] : []),
      ]);
  },
});

export const RadioGroup = defineComponent({
  name: 'UiRadioGroup',
  inheritAttrs: false,
  props: {
    modelValue: String,
    label: { type: String, required: true },
    options: {
      type: Array as PropType<readonly RadioGroupOption[]>,
      required: true,
    },
    hint: String,
    error: String,
    name: String,
    disabled: Boolean,
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
    },
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    change: (_event: Event) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const id = useId();
    const name = props.name ?? id;

    return () =>
      h(
        'div',
        mergeProps(attrs, {
          class: ['ui-field', props.error && 'ui-field--invalid'],
          role: 'radiogroup',
          'aria-label': props.label,
          'aria-describedby': describedBy(attrs['aria-describedby'], [
            props.hint && `${id}-hint`,
            props.error && `${id}-error`,
          ]),
          'aria-invalid': props.error ? 'true' : attrs['aria-invalid'],
        }),
        [
          h('span', { class: 'ui-field__label' }, props.label),
          ...(props.hint ? [fieldMessage('hint', id, props.hint)] : []),
          h(
            'div',
            {
              class: [
                'ui-choices',
                props.orientation === 'horizontal' && 'ui-choices--inline',
              ],
            },
            props.options.map((option, index) =>
              h('label', { class: 'ui-check', key: option.value }, [
                h('input', {
                  type: 'radio',
                  name,
                  value: option.value,
                  checked: props.modelValue === option.value,
                  disabled: props.disabled || option.disabled,
                  'data-testid': props.testId
                    ? `${props.testId}-${index}`
                    : undefined,
                  onChange: (event: Event) => {
                    emit('update:modelValue', option.value);
                    emit('change', event);
                  },
                  onBlur: (event: FocusEvent) => emit('blur', event),
                }),
                option.label,
              ]),
            ),
          ),
          ...(props.error ? [fieldMessage('error', id, props.error)] : []),
        ],
      );
  },
});

function latinDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
}

function splitPhone(
  value: string | null | undefined,
  countries: readonly PhoneCountry[],
  prefer: string,
): { country: string; number: string } {
  if (!value) return { country: prefer, number: '' };
  const plain = '+' + latinDigits(value).replace(/\D/g, '');
  const current = countries.find((item) => item.code === prefer);
  const match =
    current && plain.startsWith(current.dial)
      ? current
      : [...countries]
          .sort((a, b) => b.dial.length - a.dial.length)
          .find((item) => plain.startsWith(item.dial));
  return match
    ? { country: match.code, number: plain.slice(match.dial.length) }
    : { country: prefer, number: plain };
}

function fullPhone(dial: string, text: string): string | null {
  const digits = latinDigits(text).replace(/\D/g, '').replace(/^0+/, '');
  return digits ? dial + digits : null;
}

function flagEmoji(code: string): string | undefined {
  const iso = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return undefined;
  return String.fromCodePoint(
    ...Array.from(iso, (letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

export const PhoneField = defineComponent({
  name: 'UiPhoneField',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: null },
    label: { type: String, required: true },
    country: { type: String, default: 'EG' },
    countries: {
      type: Array as PropType<readonly PhoneCountry[]>,
      default: () => PHONE_COUNTRIES,
    },
    countryLabel: String,
    placeholder: String,
    hint: String,
    error: String,
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string | null) => true,
    change: (_value: string | null) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const initial = splitPhone(
      props.modelValue,
      props.countries,
      props.country,
    );
    const selectedCode = ref(initial.country);
    const number = ref(initial.number);

    const picked = computed(
      () =>
        props.countries.find((item) => item.code === selectedCode.value) ??
        props.countries[0],
    );

    watch(
      () => props.modelValue,
      (value) => {
        const own = fullPhone(picked.value?.dial ?? '', number.value);
        if (value !== own) {
          const next = splitPhone(value, props.countries, selectedCode.value);
          selectedCode.value = next.country;
          number.value = next.number;
        }
      },
    );

    const emitValue = () =>
      emit(
        'update:modelValue',
        fullPhone(picked.value?.dial ?? '', number.value),
      );

    return () =>
      h(
        'div',
        mergeProps(attrs, {
          class: [
            'ui-field ui-phone-field',
            props.error && 'ui-field--invalid',
          ],
        }),
        [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h('div', { class: 'ui-input-group' }, [
            h(
              'div',
              {
                class: 'ui-phone-field__select',
                'aria-label': props.countryLabel ?? uiLabels.value.countryCode,
              },
              [
                h(
                  'select',
                  mergeProps({
                    class: 'ui-phone-field__country',
                    'aria-label': `${props.countryLabel ?? uiLabels.value.countryCode}: ${
                      picked.value?.name ?? ''
                    } ${picked.value?.dial ?? ''}`,
                    value: picked.value?.code,
                    disabled: props.disabled,
                    'data-testid': props.testId
                      ? `${props.testId}-country`
                      : undefined,
                    onChange: (event: Event) => {
                      const code = (event.target as HTMLSelectElement).value;
                      selectedCode.value = code;
                      emitValue();
                      emit(
                        'change',
                        fullPhone(
                          props.countries.find((item) => item.code === code)
                            ?.dial ?? '',
                          number.value,
                        ),
                      );
                    },
                  }),
                  props.countries.map((item) =>
                    h(
                      'option',
                      {
                        key: item.code,
                        value: item.code,
                        'data-testid': props.testId
                          ? `${props.testId}-country-option`
                          : undefined,
                      },
                      `${flagEmoji(item.code) ?? ''} ${item.name} ${item.dial}`,
                    ),
                  ),
                ),
              ],
            ),
            h('input', {
              class: 'ui-input-group__input',
              id,
              type: 'tel',
              inputmode: 'tel',
              autocomplete: 'tel-national',
              value: number.value,
              placeholder: props.placeholder,
              disabled: props.disabled,
              'aria-invalid': props.error ? 'true' : attrs['aria-invalid'],
              'aria-describedby':
                [props.hint && `${id}-hint`, props.error && `${id}-error`]
                  .filter(Boolean)
                  .join(' ') || undefined,
              'data-testid': props.testId,
              onInput: (event: Event) => {
                number.value = (event.target as HTMLInputElement).value;
                emitValue();
                emit(
                  'change',
                  fullPhone(picked.value?.dial ?? '', number.value),
                );
              },
              onBlur: (event: FocusEvent) => emit('blur', event),
            }),
          ]),
          props.name
            ? h('input', {
                type: 'hidden',
                name: props.name,
                value: fullPhone(picked.value?.dial ?? '', number.value) ?? '',
              })
            : null,
          props.hint
            ? h('p', { class: 'ui-field__hint', id: `${id}-hint` }, props.hint)
            : null,
          props.error
            ? h(
                'p',
                { class: 'ui-field__error', id: `${id}-error`, role: 'alert' },
                props.error,
              )
            : null,
        ],
      );
  },
});

/** The icon for each tone. Shape tells the tones apart, not only colour. */
const TONE_ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

export const Alert = defineComponent({
  name: 'UiAlert',
  inheritAttrs: false,
  props: {
    tone: { type: String as PropType<AlertTone>, default: 'info' },
    title: String,
    role: { type: String as PropType<'alert' | 'status'>, default: 'status' },
    /** Accessible name of the close button; pass the translated text. */
    closeLabel: String,
    /** Listen to `@dismiss` to show a close button; remove the alert when it fires. */
    onDismiss: Function as PropType<() => void>,
  },
  setup(props, { attrs, slots }) {
    const uiLabels = useUiLabels();
    return () =>
      h(
        'div',
        mergeProps(attrs, {
          class: ['ui-alert', `ui-alert--${props.tone}`],
          role: props.role,
        }),
        [
          h(Icon, { name: TONE_ICONS[props.tone], class: 'ui-alert__icon' }),
          h('div', { class: 'ui-alert__body' }, [
            ...(props.title
              ? [h('p', { class: 'ui-alert__title' }, props.title)]
              : []),
            ...(slots.default?.() ?? []),
            ...(slots.actions
              ? [h('div', { class: 'ui-alert__actions' }, slots.actions())]
              : []),
          ]),
          ...(props.onDismiss
            ? [
                h(
                  'button',
                  {
                    type: 'button',
                    class:
                      'ui-button ui-button--ghost ui-button--md ui-alert__close',
                    'aria-label': props.closeLabel ?? uiLabels.value.dismiss,
                    onClick: () => props.onDismiss?.(),
                  },
                  h(Icon, { name: 'x', size: 'sm' }),
                ),
              ]
            : []),
        ],
      );
  },
});

export const Spinner = defineComponent({
  name: 'UiSpinner',
  inheritAttrs: false,
  props: {
    label: String,
    showLabel: Boolean,
    size: { type: String as PropType<'md' | 'lg'>, default: 'md' },
  },
  setup(props, { attrs }) {
    const uiLabels = useUiLabels();
    return () =>
      h(
        'span',
        mergeProps(attrs, {
          role: 'status',
          class: ['ui-loading', props.size === 'lg' && 'ui-loading--lg'],
        }),
        [
          h('span', { class: 'ui-spinner', 'aria-hidden': 'true' }),
          h(
            'span',
            { class: props.showLabel ? undefined : 'ui-visually-hidden' },
            props.label ?? uiLabels.value.loading,
          ),
        ],
      );
  },
});

export const Progress = defineComponent({
  name: 'UiProgress',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    value: Number,
    max: { type: Number, default: 100 },
    valueText: String,
    testId: String,
  },
  setup(props, { attrs }) {
    const id = useId();

    return () => {
      const progressValue =
        props.value == null
          ? ''
          : (props.value / props.max).toLocaleString(undefined, {
              style: 'percent',
              maximumFractionDigits: 0,
            });
      const text = props.valueText ?? progressValue;

      return h('div', mergeProps(attrs, { class: 'ui-progress' }), [
        h('div', { class: 'ui-progress__head' }, [
          h('span', { class: 'ui-progress__label', id }, props.label),
          ...(text
            ? [
                h(
                  'span',
                  { class: 'ui-progress__value', 'aria-hidden': 'true' },
                  text,
                ),
              ]
            : []),
        ]),
        h('progress', {
          class: 'ui-progress__bar',
          'aria-labelledby': id,
          'aria-valuetext': props.valueText,
          value: props.value ?? undefined,
          max: props.max,
          'data-testid': props.testId,
        }),
      ]);
    };
  },
});

export const Skeleton = defineComponent({
  name: 'UiSkeleton',
  inheritAttrs: false,
  props: {
    shape: {
      type: String as PropType<'text' | 'circle' | 'block'>,
      default: 'text',
    },
    lines: { type: Number, default: 1 },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'div',
        mergeProps(attrs, {
          'aria-hidden': 'true',
          class: ['ui-skeleton', `ui-skeleton--${props.shape}`],
        }),
        Array.from(
          {
            length:
              props.shape === 'text' ? Math.max(1, Math.floor(props.lines)) : 1,
          },
          (_, index) => h('span', { class: 'ui-skeleton__shape', key: index }),
        ),
      );
  },
});
