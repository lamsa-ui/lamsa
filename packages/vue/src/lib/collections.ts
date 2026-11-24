import {
  Teleport,
  defineComponent,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useId,
  watch,
  type InjectionKey,
  type PropType,
} from 'vue';
import type { AlertTone } from './components.js';
import { Icon, Tag } from './content.js';
import { Dialog } from './dialog.js';
import { useUiLabels } from './labels';

export interface ChipInputProps {
  modelValue?: string[];
  label: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Adds one hidden input per chip, all with this name, for forms. */
  name?: string;
  error?: string;
  removeLabel?: string;
  addedLabel?: (chip: string) => string;
  removedLabel?: (chip: string) => string;
  testId?: string;
}

/**
 * Free words typed in as chips, such as tags or emails. Enter or a comma adds one;
 * Backspace in the empty field moves to the last chip's × button.
 */
export const ChipInput = defineComponent({
  name: 'UiChipInput',
  props: {
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
    label: { type: String, required: true },
    hint: String,
    placeholder: String,
    disabled: Boolean,
    name: String,
    error: String,
    removeLabel: String,
    addedLabel: Function as PropType<(chip: string) => string>,
    removedLabel: Function as PropType<(chip: string) => string>,
    testId: String,
  },
  emits: {
    'update:modelValue': (_chips: string[]) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { emit }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const chips = ref([...props.modelValue]);
    watch(
      () => props.modelValue,
      (next) => (chips.value = [...next]),
    );
    const said = ref('');
    const box = ref<HTMLElement>();
    const field = ref<HTMLInputElement>();
    const buttons = () =>
      Array.from(
        box.value?.querySelectorAll<HTMLElement>('.ui-tag__remove') ?? [],
      );
    const set = (next: string[]) => {
      chips.value = next;
      emit('update:modelValue', next);
    };
    const remove = (i: number) => {
      const chip = chips.value[i];
      set(chips.value.filter((_, j) => j !== i));
      said.value = (props.removedLabel ?? uiLabels.value.removed)(chip);
      // Focus the next chip's × button, or the field when none is left.
      void nextTick(() => {
        const all = buttons();
        (all[Math.min(i, all.length - 1)] ?? field.value)?.focus();
      });
    };

    return () =>
      h('div', { class: ['ui-field', props.error && 'ui-field--invalid'] }, [
        h('label', { class: 'ui-field__label', for: id }, props.label),
        h('div', { class: 'ui-chips', ref: box }, [
          chips.value.length
            ? h(
                'ul',
                { class: 'ui-chips__list', 'aria-label': props.label },
                chips.value.map((chip, i) =>
                  h(
                    'li',
                    { key: chip },
                    h(
                      Tag,
                      {
                        removeLabel: props.removeLabel ?? uiLabels.value.remove,
                        onRemove: props.disabled ? undefined : () => remove(i),
                      },
                      () => chip,
                    ),
                  ),
                ),
              )
            : null,
          h('input', {
            ref: field,
            class: 'ui-chips__input',
            type: 'text',
            enterkeyhint: 'enter',
            id,
            placeholder: props.placeholder,
            disabled: props.disabled,
            'aria-invalid': props.error ? 'true' : undefined,
            'aria-describedby':
              [props.hint && `${id}-hint`, props.error && `${id}-error`]
                .filter(Boolean)
                .join(' ') || undefined,
            'data-testid': props.testId,
            onBlur: (event: FocusEvent) => emit('blur', event),
            onKeydown: (event: KeyboardEvent) => {
              const input = event.target as HTMLInputElement;
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                const chip = input.value.trim();
                input.value = '';
                if (!chip || chips.value.includes(chip)) return;
                set([...chips.value, chip]);
                said.value = (props.addedLabel ?? uiLabels.value.added)(chip);
              } else if (event.key === 'Backspace' && !input.value) {
                buttons().pop()?.focus();
              }
            },
          }),
        ]),
        ...(props.name
          ? chips.value.map((chip) =>
              h('input', {
                key: chip,
                type: 'hidden',
                name: props.name,
                value: chip,
              }),
            )
          : []),
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
        h(
          'span',
          { class: 'ui-visually-hidden', 'aria-live': 'polite' },
          said.value,
        ),
      ]);
  },
});

export interface Command {
  id: string;
  label: string;
  /** Other words that find it: "invoice" for "New bill". */
  keywords?: string[];
  /** Shown at the end of the row, such as "Ctrl N". */
  shortcut?: string;
}

export interface CommandPaletteProps {
  commands: Command[];
  /** Bind with v-model:open. */
  open: boolean;
  /** Ctrl or ⌘ plus this key opens it from anywhere; null turns it off. */
  shortcut?: string | null;
  title?: string;
  placeholder?: string;
  emptyLabel?: string;
  closeLabel?: string;
  countLabel?: (count: number) => string;
}

/** Ctrl/⌘ K: a dialog to find and run a command by typing. `@run` gets the chosen command. */
export const CommandPalette = defineComponent({
  name: 'UiCommandPalette',
  props: {
    commands: { type: Array as PropType<Command[]>, required: true },
    open: { type: Boolean, required: true },
    shortcut: { type: String as PropType<string | null>, default: 'k' },
    title: String,
    placeholder: String,
    emptyLabel: String,
    closeLabel: String,
    countLabel: Function as PropType<(count: number) => string>,
  },
  emits: {
    'update:open': (_open: boolean) => true,
    run: (_command: Command) => true,
  },
  setup(props, { emit }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const query = ref('');
    const active = ref(0);
    const reset = () => {
      query.value = '';
      active.value = 0;
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        props.shortcut &&
        (event.ctrlKey || event.metaKey) &&
        event.key === props.shortcut
      ) {
        event.preventDefault();
        reset();
        emit('update:open', true);
      }
    };
    onMounted(() => document.addEventListener('keydown', onKey));
    onBeforeUnmount(() => document.removeEventListener('keydown', onKey));

    const matches = () => {
      const words = query.value.trim().toLocaleLowerCase().split(/\s+/);
      return props.commands.filter((command) => {
        const text = [command.label, ...(command.keywords ?? [])]
          .join(' ')
          .toLocaleLowerCase();
        return words.every((word) => text.includes(word));
      });
    };
    const run = (command?: Command) => {
      if (!command) return;
      emit('update:open', false);
      requestAnimationFrame(() => emit('run', command));
    };

    return () => {
      const found = matches();
      return h(
        Dialog,
        {
          title: props.title ?? uiLabels.value.commands,
          open: props.open,
          closeLabel: props.closeLabel ?? uiLabels.value.close,
          'onUpdate:open': (next: boolean) => {
            if (next) reset();
            emit('update:open', next);
          },
        },
        () =>
          h('div', { class: 'ui-command' }, [
            h('input', {
              class: 'ui-input',
              type: 'text',
              role: 'combobox',
              autocomplete: 'off',
              autofocus: true,
              'aria-autocomplete': 'list',
              'aria-expanded': 'true',
              'aria-label': props.title ?? uiLabels.value.commands,
              'aria-controls': `${id}-list`,
              'aria-activedescendant': found.length
                ? `${id}-${active.value}`
                : undefined,
              placeholder: props.placeholder ?? uiLabels.value.typeCommand,
              value: query.value,
              onInput: (event: Event) => {
                query.value = (event.target as HTMLInputElement).value;
                active.value = 0;
              },
              onKeydown: (event: KeyboardEvent) => {
                const count = found.length;
                if (!count) return;
                const moves: Record<string, number> = {
                  ArrowDown: 1,
                  ArrowUp: -1,
                };
                if (event.key in moves) {
                  event.preventDefault();
                  active.value =
                    (active.value + moves[event.key] + count) % count;
                  document
                    .getElementById(`${id}-${active.value}`)
                    ?.scrollIntoView?.({ block: 'nearest' });
                } else if (event.key === 'Enter') {
                  event.preventDefault();
                  run(found[active.value]);
                }
              },
            }),
            found.length
              ? h(
                  'ul',
                  {
                    class: 'ui-command__list',
                    role: 'listbox',
                    id: `${id}-list`,
                    'aria-label': props.title ?? uiLabels.value.commands,
                  },
                  found.map((command, i) =>
                    h(
                      'li',
                      {
                        key: command.id,
                        id: `${id}-${i}`,
                        role: 'option',
                        class: [
                          'ui-option',
                          i === active.value && 'ui-option--active',
                        ],
                        'aria-selected': i === active.value,
                        onMousedown: (event: MouseEvent) =>
                          event.preventDefault(),
                        onMousemove: () => (active.value = i),
                        onClick: () => run(command),
                      },
                      [
                        command.label,
                        command.shortcut
                          ? h(
                              'kbd',
                              { class: 'ui-command__shortcut' },
                              command.shortcut,
                            )
                          : null,
                      ],
                    ),
                  ),
                )
              : h(
                  'p',
                  { class: 'ui-command__empty', id: `${id}-list` },
                  props.emptyLabel ?? uiLabels.value.noCommands,
                ),
            h(
              'span',
              { class: 'ui-visually-hidden', role: 'status' },
              (props.countLabel ?? uiLabels.value.commandCount)(found.length),
            ),
          ]),
      );
    };
  },
});

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  /** Text for the cell; a `#cell-<key>` slot ({ row }) replaces it with markup. */
  value?: (row: T) => string | number;
}

export interface TableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface DataTableProps {
  caption: string;
  hideCaption?: boolean;
  columns: readonly TableColumn[];
  rows: readonly Record<string, unknown>[];
  /** The field that tells rows apart, or a function; the index otherwise. */
  rowKey?: string | ((row: Record<string, unknown>) => string | number);
  /** Bind with v-model:sort; the rows are yours to sort. */
  sort?: TableSort | null;
  loading?: boolean;
  loadingLabel?: string;
  emptyMessage?: string;
}

const alignClass = (column: TableColumn) =>
  column.align && column.align !== 'start'
    ? `ui-table__cell--${column.align}`
    : undefined;

/** Rows and columns with sortable headers, a loading state and an empty message. */
export const DataTable = defineComponent({
  name: 'UiDataTable',
  props: {
    caption: { type: String, required: true },
    hideCaption: Boolean,
    columns: {
      type: Array as PropType<readonly TableColumn[]>,
      required: true,
    },
    rows: {
      type: Array as PropType<readonly Record<string, unknown>[]>,
      required: true,
    },
    rowKey: [String, Function] as PropType<
      string | ((row: Record<string, unknown>) => string | number)
    >,
    sort: { type: Object as PropType<TableSort | null>, default: null },
    loading: Boolean,
    loadingLabel: String,
    emptyMessage: String,
  },
  emits: { 'update:sort': (_sort: TableSort) => true },
  setup(props, { emit, slots }) {
    const uiLabels = useUiLabels();
    const captionId = useId();
    const wrap = ref<HTMLElement>();
    const scrolls = ref(false);
    let observer: ResizeObserver | undefined;
    onMounted(() => {
      const el = wrap.value;
      if (!el) return;
      const check = () => (scrolls.value = el.scrollWidth > el.clientWidth + 1);
      check();
      if (typeof ResizeObserver === 'undefined') return;
      observer = new ResizeObserver(check);
      observer.observe(el);
    });
    onBeforeUnmount(() => observer?.disconnect());

    const ariaSort = (column: TableColumn) =>
      column.sortable
        ? props.sort?.key === column.key
          ? props.sort.direction
          : 'none'
        : undefined;
    const sortIcon = (sort?: string) =>
      sort === 'ascending'
        ? 'chevron-up'
        : sort === 'descending'
          ? 'chevron-down'
          : 'chevrons-up-down';
    const keyOf = (row: Record<string, unknown>, index: number) =>
      props.rowKey === undefined
        ? index
        : typeof props.rowKey === 'function'
          ? props.rowKey(row)
          : (row[props.rowKey] as string | number);

    return () =>
      h(
        'div',
        {
          ref: wrap,
          class: 'ui-table-wrap',
          tabindex: scrolls.value ? 0 : undefined,
          role: scrolls.value ? 'region' : undefined,
          'aria-labelledby': scrolls.value ? captionId : undefined,
          'aria-busy': props.loading || undefined,
        },
        [
          h('table', { class: 'ui-table' }, [
            h(
              'caption',
              {
                id: captionId,
                class: [
                  'ui-table__caption',
                  props.hideCaption && 'ui-visually-hidden',
                ],
              },
              props.caption,
            ),
            h(
              'thead',
              h(
                'tr',
                props.columns.map((column) =>
                  h(
                    'th',
                    {
                      key: column.key,
                      scope: 'col',
                      class: alignClass(column),
                      'aria-sort': ariaSort(column),
                    },
                    column.sortable
                      ? h(
                          'button',
                          {
                            type: 'button',
                            class: 'ui-table__sort',
                            'data-testid': `ui-sort-${column.key}`,
                            onClick: () =>
                              emit('update:sort', {
                                key: column.key,
                                direction:
                                  props.sort?.key === column.key &&
                                  props.sort.direction === 'ascending'
                                    ? 'descending'
                                    : 'ascending',
                              }),
                          },
                          [
                            column.header,
                            h(Icon, {
                              class: 'ui-table__sort-icon',
                              name: sortIcon(ariaSort(column)),
                            }),
                          ],
                        )
                      : column.header,
                  ),
                ),
              ),
            ),
            h(
              'tbody',
              props.rows.length
                ? props.rows.map((row, index) =>
                    h(
                      'tr',
                      { key: keyOf(row, index) },
                      props.columns.map((column) =>
                        h(
                          'td',
                          { key: column.key, class: alignClass(column) },
                          slots[`cell-${column.key}`]?.({ row }) ??
                            String(
                              column.value?.(row) ?? row[column.key] ?? '',
                            ),
                        ),
                      ),
                    ),
                  )
                : h(
                    'tr',
                    h(
                      'td',
                      {
                        class: 'ui-table__empty',
                        colspan: props.columns.length,
                      },
                      props.loading
                        ? ''
                        : (props.emptyMessage ?? uiLabels.value.noResults),
                    ),
                  ),
            ),
          ]),
          props.loading
            ? h(
                'div',
                { class: 'ui-table__loading', 'aria-hidden': 'true' },
                h('span', { class: 'ui-spinner' }),
              )
            : null,
          h(
            'span',
            { class: 'ui-visually-hidden', role: 'status' },
            props.loading ? (props.loadingLabel ?? uiLabels.value.loading) : '',
          ),
        ],
      );
  },
});

export interface ToastOptions {
  tone?: AlertTone;
  title?: string;
  /** Milliseconds before it goes; 0 keeps it. Default 6000, or 0 with an action. */
  duration?: number;
  action?: { label: string; run: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
  message: string;
}

export interface ToastApi {
  show: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const TOASTS: InjectionKey<ToastApi> = Symbol('toasts');

const TONE_ICONS = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
} as const;

export interface ToastProviderProps {
  /** Names the toast region; pass the translated text. */
  label?: string;
  closeLabel?: string;
}

/**
 * Put it once around the app; `useToast()` in any component below shows messages.
 * Danger toasts are read at once; the rest wait for a pause. Hover or focus pauses them.
 */
export const ToastProvider = defineComponent({
  name: 'UiToastProvider',
  props: {
    label: String,
    closeLabel: String,
  },
  setup(props, { slots }) {
    const uiLabels = useUiLabels();
    const toasts = ref<ToastItem[]>([]);
    const said = ref({ polite: '', assertive: '' });
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    let nextId = 0;
    let paused = false;

    const dismiss = (id: number) => {
      clearTimeout(timers.get(id));
      timers.delete(id);
      toasts.value = toasts.value.filter((t) => t.id !== id);
    };
    const schedule = (toast: ToastItem) => {
      const duration = toast.duration ?? (toast.action ? 0 : 6000);
      if (duration > 0 && !paused)
        timers.set(
          toast.id,
          setTimeout(() => dismiss(toast.id), duration),
        );
    };
    const show = (message: string, options: ToastOptions = {}) => {
      const id = nextId++;
      const toast = { ...options, message, id };
      toasts.value = [...toasts.value, toast];
      // A trailing no-break space on every other message, so the same text is read twice.
      const text =
        [options.title, message].filter(Boolean).join('. ') +
        (id % 2 ? ' ' : '');
      said.value =
        options.tone === 'danger'
          ? { polite: '', assertive: text }
          : { polite: text, assertive: '' };
      schedule(toast);
      return id;
    };
    const pause = (on: boolean) => {
      paused = on;
      if (on) {
        timers.forEach((t) => clearTimeout(t));
        timers.clear();
      } else toasts.value.forEach(schedule);
    };
    onBeforeUnmount(() => timers.forEach((t) => clearTimeout(t)));
    provide(TOASTS, { show, dismiss });

    return () => [
      slots.default?.(),
      h(
        'div',
        { class: 'ui-visually-hidden', 'aria-live': 'polite' },
        said.value.polite,
      ),
      h(
        'div',
        { class: 'ui-visually-hidden', 'aria-live': 'assertive' },
        said.value.assertive,
      ),
      toasts.value.length
        ? h(Teleport, { to: 'body' }, [
            h(
              'section',
              {
                'aria-label': props.label ?? uiLabels.value.notifications,
                onMouseenter: () => pause(true),
                onMouseleave: () => pause(false),
                onFocusin: () => pause(true),
                onFocusout: () => pause(false),
              },
              h(
                'ol',
                { class: 'ui-toast-region' },
                toasts.value.map((toast) =>
                  h(
                    'li',
                    {
                      key: toast.id,
                      class: `ui-alert ui-toast ui-alert--${toast.tone ?? 'info'}`,
                      'data-testid': 'ui-toast',
                    },
                    [
                      h(Icon, {
                        name: TONE_ICONS[toast.tone ?? 'info'],
                        class: 'ui-alert__icon',
                      }),
                      h('div', { class: 'ui-alert__body' }, [
                        toast.title
                          ? h('p', { class: 'ui-alert__title' }, toast.title)
                          : null,
                        h('p', toast.message),
                        toast.action
                          ? h(
                              'div',
                              { class: 'ui-alert__actions' },
                              h(
                                'button',
                                {
                                  type: 'button',
                                  class:
                                    'ui-button ui-button--secondary ui-button--sm',
                                  onClick: () => {
                                    toast.action?.run();
                                    dismiss(toast.id);
                                  },
                                },
                                toast.action.label,
                              ),
                            )
                          : null,
                      ]),
                      h(
                        'button',
                        {
                          type: 'button',
                          class:
                            'ui-button ui-button--ghost ui-button--md ui-alert__close',
                          'aria-label':
                            props.closeLabel ?? uiLabels.value.dismiss,
                          onClick: () => dismiss(toast.id),
                        },
                        h(Icon, { name: 'x', size: 'sm' }),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ])
        : null,
    ];
  },
});

/** Show and dismiss toasts. Needs a `<ToastProvider>` above the component. */
export function useToast(): ToastApi {
  const api = inject(TOASTS, null);
  if (!api)
    throw new Error('useToast() needs a <ToastProvider> around the app.');
  return api;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface AppShellProps {
  menuLabel?: string;
  /** Id of the main area, the target of a "Skip to content" link. */
  mainId?: string;
  /** banner and main roles; turn off when the page already has them. */
  landmarks?: boolean;
}

/**
 * The frame of an app: a header (`#brand`, `#actions`), a side bar (`#sidebar`) that folds
 * into a menu on small screens, and the main area (default slot). Escape closes the menu.
 */
export const AppShell = defineComponent({
  name: 'UiAppShell',
  props: {
    menuLabel: String,
    mainId: { type: String, default: 'main' },
    landmarks: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const uiLabels = useUiLabels();
    const id = useId();
    const open = ref(false);
    const menu = ref<HTMLButtonElement>();
    const side = ref<HTMLElement>();
    watch(open, (now) => {
      if (now)
        void nextTick(() =>
          side.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
        );
    });
    return () =>
      h(
        'div',
        {
          class: ['ui-shell', open.value && 'ui-shell--open'],
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open.value) {
              open.value = false;
              menu.value?.focus();
            }
          },
        },
        [
          h(
            'div',
            {
              class: 'ui-shell__header',
              role: props.landmarks ? 'banner' : undefined,
            },
            [
              h(
                'button',
                {
                  ref: menu,
                  type: 'button',
                  class:
                    'ui-button ui-button--ghost ui-button--icon ui-shell__menu',
                  'aria-label': props.menuLabel ?? uiLabels.value.menu,
                  'aria-expanded': open.value,
                  'aria-controls': id,
                  onClick: () => (open.value = !open.value),
                },
                h(Icon, { name: open.value ? 'x' : 'menu' }),
              ),
              slots.brand?.(),
              slots.actions?.(),
            ],
          ),
          h('div', { class: 'ui-shell__body' }, [
            open.value
              ? h('div', {
                  class: 'ui-shell__scrim',
                  'aria-hidden': 'true',
                  onClick: () => (open.value = false),
                })
              : null,
            h(
              'div',
              {
                ref: side,
                id,
                class: 'ui-shell__sidebar',
                // Following a link in the folded side bar closes it, as the page changes.
                onClick: (e: MouseEvent) => {
                  if ((e.target as Element).closest('a[href]'))
                    open.value = false;
                },
              },
              slots.sidebar?.(),
            ),
            h(
              'div',
              {
                id: props.mainId,
                class: 'ui-shell__main',
                tabindex: -1,
                role: props.landmarks ? 'main' : undefined,
              },
              slots.default?.(),
            ),
          ]),
        ],
      );
  },
});
