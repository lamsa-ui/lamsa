import {
  defineComponent,
  h,
  mergeProps,
  onMounted,
  ref,
  useId,
  watch,
  type PropType,
} from 'vue';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonGroupProps {
  /** What the buttons do together, for screen readers: "Text alignment". */
  label: string;
}

/** Buttons that belong together, joined into one bar and named as a group. */
export const ButtonGroup = defineComponent({
  name: 'UiButtonGroup',
  props: { label: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: 'ui-button-group', role: 'group', 'aria-label': props.label },
        slots.default?.(),
      );
  },
});

export interface ToggleProps {
  pressed?: boolean;
  size?: ButtonSize;
  iconOnly?: boolean;
  disabled?: boolean;
}

/**
 * A button that stays pressed until pressed again, such as "Pin" or a view switch.
 * Bind it with v-model:pressed. Screen readers hear "pressed" or "not pressed".
 */
export const Toggle = defineComponent({
  name: 'UiToggle',
  props: {
    pressed: { type: Boolean, default: undefined },
    size: { type: String as PropType<ButtonSize>, default: 'md' },
    iconOnly: Boolean,
    disabled: Boolean,
  },
  emits: { 'update:pressed': (_pressed: boolean) => true },
  setup(props, { emit, slots }) {
    // Keeps its own state when v-model:pressed is not bound.
    const on = ref(props.pressed ?? false);
    watch(
      () => props.pressed,
      (value) => {
        if (value !== undefined) on.value = value;
      },
    );
    return () =>
      h(
        'button',
        {
          type: 'button',
          class: [
            'ui-button ui-button--secondary',
            `ui-button--${props.size}`,
            'ui-toggle',
            props.iconOnly && 'ui-button--icon',
          ],
          'aria-pressed': on.value ? 'true' : 'false',
          disabled: props.disabled,
          onClick: () => {
            on.value = !on.value;
            emit('update:pressed', on.value);
          },
        },
        slots.default?.(),
      );
  },
});

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled)';

/** Where an arrow, Home or End key moves focus in a toolbar, wrapping at the ends; null for any other key. */
export function toolbarStep(
  key: string,
  at: number,
  count: number,
  orientation: 'horizontal' | 'vertical',
  rtl: boolean,
): number | null {
  const step: Record<string, number> =
    orientation === 'vertical'
      ? { ArrowDown: 1, ArrowUp: -1 }
      : { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
  if (key in step) return (at + step[key] + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

export interface ToolbarProps {
  label: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A row of controls that is one tab stop: Tab enters and leaves it, the arrow keys move
 * inside it (flipped in right-to-left pages), Home and End jump to the ends.
 */
export const Toolbar = defineComponent({
  name: 'UiToolbar',
  props: {
    label: { type: String, required: true },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
  },
  setup(props, { slots }) {
    const root = ref<HTMLElement>();
    const items = () =>
      [...(root.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
        (el) => el.closest('.ui-toolbar') === root.value,
      );
    const focusable = (current?: HTMLElement) => {
      for (const item of items()) item.tabIndex = item === current ? 0 : -1;
    };
    onMounted(() => focusable(items()[0]));
    return () =>
      h(
        'div',
        {
          ref: root,
          class: 'ui-toolbar',
          role: 'toolbar',
          'aria-label': props.label,
          'aria-orientation': props.orientation,
          onFocusin: (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (items().includes(target)) focusable(target);
          },
          onKeydown: (event: KeyboardEvent) => {
            const list = items();
            const at = list.indexOf(event.target as HTMLElement);
            if (at < 0 || !root.value) return;
            const next = toolbarStep(
              event.key,
              at,
              list.length,
              props.orientation,
              getComputedStyle(root.value).direction === 'rtl',
            );
            if (next == null) return;
            event.preventDefault();
            focusable(list[next]);
            list[next].focus();
          },
        },
        slots.default?.(),
      );
  },
});

/** A thin line between groups of controls in a toolbar. */
export const ToolbarSeparator = defineComponent({
  name: 'UiToolbarSeparator',
  setup() {
    return () =>
      h('div', { class: 'ui-toolbar__separator', role: 'separator' });
  },
});

/** A key on the keyboard, on the native `<kbd>`. For a shortcut, one per key. */
export const Kbd = defineComponent({
  name: 'UiKbd',
  setup(_, { slots }) {
    return () => h('kbd', { class: 'ui-kbd' }, slots.default?.());
  },
});

export type MeterTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface MeterProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  valueText?: string;
  tone?: MeterTone;
}

/** Where value sits between min and max, from 0 to 1, clamped. */
export function meterRatio(value: number, min: number, max: number): number {
  return Math.min(Math.max((value - min) / (max - min || 1), 0), 1);
}

/**
 * A level inside a known range, such as storage used or a score: not work in progress
 * (that is Progress). The value is written beside the label; the tone only repeats it.
 */
export const Meter = defineComponent({
  name: 'UiMeter',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    valueText: String,
    tone: { type: String as PropType<MeterTone>, default: 'neutral' },
  },
  setup(props, { attrs }) {
    const id = useId();
    return () => {
      const ratio = meterRatio(props.value, props.min, props.max);
      const text =
        props.valueText ??
        new Intl.NumberFormat(undefined, { style: 'percent' }).format(ratio);
      return h(
        'div',
        mergeProps(attrs, {
          class: [
            'ui-meter',
            props.tone !== 'neutral' && `ui-meter--${props.tone}`,
          ],
        }),
        [
          h('div', { class: 'ui-meter__head' }, [
            h('span', { class: 'ui-meter__label', id }, props.label),
            h(
              'span',
              { class: 'ui-meter__value', 'aria-hidden': 'true' },
              text,
            ),
          ]),
          h(
            'div',
            {
              class: 'ui-meter__bar',
              role: 'meter',
              'aria-labelledby': id,
              'aria-valuenow': props.value,
              'aria-valuemin': props.min,
              'aria-valuemax': props.max,
              'aria-valuetext': text,
            },
            h('span', {
              class: 'ui-meter__fill',
              style: { '--ui-meter-value': `${ratio * 100}%` },
            }),
          ),
        ],
      );
    };
  },
});

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface StatusDotProps {
  tone?: StatusTone;
}

/** A coloured dot before the word for a status: "Online". The word carries the meaning. */
export const StatusDot = defineComponent({
  name: 'UiStatusDot',
  props: {
    tone: { type: String as PropType<StatusTone>, default: 'neutral' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'span',
        {
          class: [
            'ui-status-dot',
            props.tone !== 'neutral' && `ui-status-dot--${props.tone}`,
          ],
        },
        slots.default?.(),
      );
  },
});

export interface PropertyListProps {
  layout?: 'columns' | 'stacked';
}

/** Label and value pairs on a native `<dl>`, such as order details. */
export const PropertyList = defineComponent({
  name: 'UiPropertyList',
  props: {
    layout: {
      type: String as PropType<'columns' | 'stacked'>,
      default: 'columns',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'dl',
        {
          class: [
            'ui-property-list',
            props.layout === 'stacked' && 'ui-property-list--stacked',
          ],
        },
        slots.default?.(),
      );
  },
});

export interface PropertyProps {
  term: string;
}

/** One pair in a property list: the term, and the value in the default slot. */
export const Property = defineComponent({
  name: 'UiProperty',
  props: { term: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'ui-property-list__item' }, [
        h('dt', props.term),
        h('dd', slots.default?.()),
      ]);
  },
});
