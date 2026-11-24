import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import { defineComponent, h, ref, useId, type PropType } from 'vue';
import type { ButtonVariant } from './components.js';
import { Icon } from './content.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Popups sit on the popover layer and, for lists, as wide as their trigger. */
const popupStyle = (width?: string) => ({
  inlineSize: width,
  zIndex: 'var(--ui-layer-popover)',
});

const fieldMessage = (kind: 'hint' | 'error', id: string, text?: string) =>
  text
    ? h(
        'p',
        {
          class: `ui-field__${kind}`,
          id: `${id}-${kind}`,
          ...(kind === 'error' ? { role: 'alert' } : {}),
        },
        text,
      )
    : null;

export interface SelectProps {
  modelValue?: string | null;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** Pick one of a few known options from a list. Typing a letter jumps to it. */
export const Select = defineComponent({
  name: 'UiSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: String as PropType<string | null>, default: undefined },
    label: { type: String, required: true },
    options: {
      type: Array as PropType<readonly SelectOption[]>,
      required: true,
    },
    placeholder: { type: String, default: '' },
    error: String,
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
    // Reka moves real focus onto the highlighted option; mirror it as the kit's class.
    const active = ref<string>();
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: [
            'ui-field',
            props.error && 'ui-field--invalid',
            attrs['class'],
          ],
        },
        [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h(
            SelectRoot,
            {
              modelValue: props.modelValue ?? undefined,
              'onUpdate:modelValue': (v: unknown) =>
                emit('update:modelValue', String(v)),
              disabled: props.disabled,
              name: props.name,
            },
            () => [
              h(
                SelectTrigger,
                {
                  id,
                  class: 'ui-select__trigger',
                  'data-testid': props.testId,
                  'aria-invalid': props.error ? 'true' : undefined,
                  'aria-describedby': props.error ? `${id}-error` : undefined,
                  onBlur: (event: FocusEvent) => emit('blur', event),
                },
                () => [
                  h(SelectValue, {
                    placeholder: props.placeholder,
                    class: props.modelValue
                      ? undefined
                      : 'ui-select__placeholder',
                  }),
                  h(Icon, {
                    name: 'chevron-down',
                    class: 'ui-select__chevron',
                  }),
                ],
              ),
              h(SelectPortal, null, () =>
                h(
                  SelectContent,
                  {
                    position: 'popper',
                    sideOffset: 4,
                    class: 'ui-listbox',
                    style: popupStyle('var(--reka-select-trigger-width)'),
                  },
                  () =>
                    h(SelectViewport, null, () =>
                      props.options.map((option, index) =>
                        h(
                          SelectItem,
                          {
                            key: option.value,
                            value: option.value,
                            disabled: option.disabled,
                            textValue: option.label,
                            class: [
                              'ui-option',
                              active.value === option.value &&
                                'ui-option--active',
                            ],
                            'data-testid': props.testId
                              ? `${props.testId}-option-${index}`
                              : undefined,
                            onFocus: () => (active.value = option.value),
                            onBlur: () => (active.value = undefined),
                          },
                          () => h(SelectItemText, null, () => option.label),
                        ),
                      ),
                    ),
                ),
              ),
            ],
          ),
          fieldMessage('error', id, props.error),
        ],
      );
  },
});

export interface ComboboxProps {
  modelValue?: string | null;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Shown when nothing matches what was typed. */
  emptyText?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** A text field that filters a long list as you type, such as countries. */
export const Combobox = defineComponent({
  name: 'UiCombobox',
  inheritAttrs: false,
  props: {
    modelValue: { type: String as PropType<string | null>, default: undefined },
    label: { type: String, required: true },
    options: {
      type: Array as PropType<readonly SelectOption[]>,
      required: true,
    },
    placeholder: String,
    hint: String,
    error: String,
    emptyText: { type: String, default: 'No matches' },
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string | null) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const id = useId();
    const active = ref<unknown>();
    const labelOf = (value: unknown) =>
      props.options.find((o) => o.value === value)?.label ?? '';
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: [
            'ui-field',
            props.error && 'ui-field--invalid',
            attrs['class'],
          ],
        },
        [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h(
            ComboboxRoot,
            {
              modelValue: props.modelValue ?? undefined,
              'onUpdate:modelValue': (v: unknown) =>
                emit('update:modelValue', (v as string | undefined) ?? null),
              disabled: props.disabled,
              name: props.name,
              onHighlight: (payload?: { value: unknown }) =>
                (active.value = payload?.value),
            },
            () => [
              h(ComboboxAnchor, { asChild: true }, () =>
                h(ComboboxInput, {
                  id,
                  class: 'ui-input',
                  placeholder: props.placeholder,
                  displayValue: labelOf,
                  'data-testid': props.testId,
                  'aria-invalid': props.error ? 'true' : undefined,
                  'aria-describedby':
                    [props.hint && `${id}-hint`, props.error && `${id}-error`]
                      .filter(Boolean)
                      .join(' ') || undefined,
                  onBlur: (event: FocusEvent) => emit('blur', event),
                }),
              ),
              h(ComboboxPortal, null, () =>
                h(
                  ComboboxContent,
                  {
                    position: 'popper',
                    sideOffset: 4,
                    class: 'ui-listbox',
                    style: popupStyle('var(--reka-combobox-trigger-width)'),
                  },
                  () =>
                    h(ComboboxViewport, null, () => [
                      h(
                        ComboboxEmpty,
                        { class: 'ui-listbox__empty', role: 'status' },
                        () => props.emptyText,
                      ),
                      ...props.options.map((option, index) =>
                        h(
                          ComboboxItem,
                          {
                            key: option.value,
                            value: option.value,
                            disabled: option.disabled,
                            textValue: option.label,
                            class: [
                              'ui-option',
                              active.value === option.value &&
                                'ui-option--active',
                            ],
                            'data-testid': props.testId
                              ? `${props.testId}-option-${index}`
                              : undefined,
                          },
                          () => option.label,
                        ),
                      ),
                    ]),
                ),
              ),
            ],
          ),
          fieldMessage('hint', id, props.hint),
          fieldMessage('error', id, props.error),
        ],
      );
  },
});

export interface MenuAction {
  id: string;
  label: string;
  /** For an action that destroys something: brand red text. */
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  /** The trigger's text; the `#label` slot replaces it (an icon, a count). */
  label?: string;
  items: readonly MenuAction[];
  variant?: ButtonVariant;
  testId?: string;
  /** The list is as wide as the trigger, for a picker such as rows per page. */
  matchTriggerWidth?: boolean;
}

/** A short list of actions that opens from a button. `@action` gets the chosen item's id. */
export const Menu = defineComponent({
  name: 'UiMenu',
  inheritAttrs: false,
  props: {
    label: String,
    items: { type: Array as PropType<readonly MenuAction[]>, required: true },
    variant: { type: String as PropType<ButtonVariant>, default: 'secondary' },
    testId: String,
    matchTriggerWidth: Boolean,
  },
  emits: { action: (_id: string) => true },
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(DropdownMenuRoot, null, () => [
        h(
          DropdownMenuTrigger,
          {
            ...attrs,
            class: [
              'ui-button',
              `ui-button--${props.variant}`,
              'ui-button--md',
            ],
            'data-testid': props.testId,
          },
          () => slots.label?.() ?? props.label,
        ),
        h(DropdownMenuPortal, null, () =>
          h(
            DropdownMenuContent,
            {
              side: 'bottom',
              align: 'start',
              sideOffset: 0,
              class: [
                'ui-menu',
                props.matchTriggerWidth && 'ui-menu--trigger-width',
              ],
              style: popupStyle(
                props.matchTriggerWidth
                  ? 'var(--reka-dropdown-menu-trigger-width)'
                  : undefined,
              ),
            },
            () =>
              props.items.map((item) =>
                h(
                  DropdownMenuItem,
                  {
                    key: item.id,
                    disabled: item.disabled,
                    class: [
                      'ui-menu__item',
                      item.danger && 'ui-menu__item--danger',
                    ],
                    onSelect: () => emit('action', item.id),
                  },
                  () => item.label,
                ),
              ),
          ),
        ),
      ]);
  },
});

export interface ContextMenuProps {
  items: readonly MenuAction[];
  disabled?: boolean;
}

/**
 * Opens a menu where the reader right-clicks or long-presses, or presses Shift+F10 or the
 * menu key on a focused element inside the default slot. Put the same actions somewhere
 * visible too: touch and keyboard users rarely look for a context menu.
 */
export const ContextMenu = defineComponent({
  name: 'UiContextMenu',
  props: {
    items: { type: Array as PropType<readonly MenuAction[]>, required: true },
    disabled: Boolean,
  },
  emits: { action: (_id: string) => true },
  setup(props, { emit, slots }) {
    return () =>
      h(ContextMenuRoot, null, () => [
        h(ContextMenuTrigger, { as: 'div', disabled: props.disabled }, () =>
          slots.default?.(),
        ),
        h(ContextMenuPortal, null, () =>
          h(ContextMenuContent, { class: 'ui-menu', style: popupStyle() }, () =>
            props.items.map((item) =>
              h(
                ContextMenuItem,
                {
                  key: item.id,
                  disabled: item.disabled,
                  class: [
                    'ui-menu__item',
                    item.danger && 'ui-menu__item--danger',
                  ],
                  onSelect: () => emit('action', item.id),
                },
                () => item.label,
              ),
            ),
          ),
        ),
      ]);
  },
});
