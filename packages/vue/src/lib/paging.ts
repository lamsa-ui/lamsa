import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui';
import { defineComponent, h, type PropType } from 'vue';
import { Icon } from './content.js';
import { Menu } from './select.js';
import { useUiLabels } from './labels';

/** Page numbers to show, with 0 for a gap: 1 … 4 5 6 … 20. Never more than seven slots. */
export function pageSlots(page: number, count: number): number[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const shown = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => shown.add(p));
  if (page >= count - 2)
    [count - 3, count - 2, count - 1].forEach((p) => shown.add(p));
  const pages = [...shown]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  const slots: number[] = [];
  for (const p of pages) {
    const previous = slots[slots.length - 1];
    if (previous !== undefined && p - previous === 2) slots.push(p - 1);
    else if (previous !== undefined && p - previous > 2) slots.push(0);
    slots.push(p);
  }
  return slots;
}

export interface PaginationLabels {
  nav: string;
  previous: string;
  next: string;
  page: (page: number) => string;
  summary: (first: number, last: number, total: number) => string;
  pageSize: string;
}

export interface PaginationProps {
  /** The current page, from 1. Bind with v-model:page. */
  page: number;
  total: number;
  /** Bind with v-model:pageSize to let people change it from pageSizes. */
  pageSize?: number;
  pageSizes?: readonly number[];
  labels?: Partial<PaginationLabels>;
}

/** Pages of a long list: a summary ("11–20 of 57"), page buttons and an optional page size. */
export const Pagination = defineComponent({
  name: 'UiPagination',
  props: {
    page: { type: Number, required: true },
    total: { type: Number, required: true },
    pageSize: { type: Number, default: 10 },
    pageSizes: {
      type: Array as PropType<readonly number[]>,
      default: () => [],
    },
    labels: Object as PropType<Partial<PaginationLabels>>,
  },
  emits: {
    'update:page': (_page: number) => true,
    'update:pageSize': (_size: number) => true,
  },
  setup(props, { emit }) {
    const uiLabels = useUiLabels();
    return () => {
      const text = { ...uiLabels.value.pagination, ...props.labels };
      const { page, pageSize, total } = props;
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const first = Math.min(total, (page - 1) * pageSize + 1);
      const last = Math.min(total, page * pageSize);
      const go = (target: number) => {
        if (target >= 1 && target <= pageCount && target !== page)
          emit('update:page', target);
      };
      const step = (
        label: string,
        icon: string,
        target: number,
        off: boolean,
        testId: string,
      ) =>
        h(
          'button',
          {
            type: 'button',
            class:
              'ui-button ui-button--ghost ui-button--sm ui-pagination__step',
            'data-testid': testId,
            'aria-label': label,
            'aria-disabled': off || undefined,
            onClick: () => go(target),
          },
          h(Icon, {
            name: icon as 'chevron-left',
            class: 'ui-pagination__arrow',
          }),
        );

      return h('nav', { class: 'ui-pagination', 'aria-label': text.nav }, [
        h(
          'p',
          { class: 'ui-pagination__summary', role: 'status' },
          text.summary(first, last, total),
        ),
        props.pageSizes.length
          ? h('div', { class: 'ui-pagination__size' }, [
              h('span', text.pageSize),
              h(
                Menu,
                {
                  'aria-label': `${text.pageSize}: ${pageSize}`,
                  matchTriggerWidth: true,
                  testId: 'ui-pagination-size',
                  items: props.pageSizes.map((size) => ({
                    id: String(size),
                    label: String(size),
                  })),
                  onAction: (size: string) => {
                    const next = Number(size);
                    if (next !== pageSize) {
                      emit('update:pageSize', next);
                      emit('update:page', 1);
                    }
                  },
                },
                {
                  label: () => [
                    String(pageSize),
                    h(Icon, {
                      name: 'chevron-down',
                      class: 'ui-select__chevron',
                    }),
                  ],
                },
              ),
            ])
          : null,
        h('ul', { class: 'ui-pagination__list' }, [
          h(
            'li',
            step(
              text.previous,
              'chevron-left',
              page - 1,
              page <= 1,
              'ui-pagination-previous',
            ),
          ),
          ...pageSlots(page, pageCount).map((slot, index) =>
            h(
              'li',
              { key: slot === 0 ? `gap-${index}` : slot },
              slot === 0
                ? h(
                    'span',
                    { class: 'ui-pagination__gap', 'aria-hidden': 'true' },
                    '…',
                  )
                : h(
                    'button',
                    {
                      type: 'button',
                      class:
                        'ui-button ui-button--ghost ui-button--sm ui-pagination__page',
                      'aria-label': text.page(slot),
                      'aria-current': slot === page ? 'page' : undefined,
                      onClick: () => go(slot),
                    },
                    String(slot),
                  ),
            ),
          ),
          h(
            'li',
            step(
              text.next,
              'chevron-right',
              page + 1,
              page >= pageCount,
              'ui-pagination-next',
            ),
          ),
        ]),
      ]);
    };
  },
});

export interface Language {
  /** BCP 47 code, such as "ar" or "en". */
  code: string;
  /** The language's name in itself: "العربية", "English". */
  name: string;
}

export interface LanguageSwitcherProps {
  languages: readonly Language[];
  /** The current language's code. Bind with v-model:current. */
  current: string;
  /** Names the menu for three or more languages. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Two languages: one button that names the other language in itself. Three or more:
 * a menu of languages with a ✓ on the current one.
 */
export const LanguageSwitcher = defineComponent({
  name: 'UiLanguageSwitcher',
  props: {
    languages: { type: Array as PropType<readonly Language[]>, required: true },
    current: { type: String, required: true },
    label: String,
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
  },
  emits: { 'update:current': (_code: string) => true },
  setup(props, { emit }) {
    const uiLabels = useUiLabels();
    const globe = () => h(Icon, { name: 'globe', size: 'sm' });
    return () => {
      const button = `ui-button ui-button--secondary ui-button--${props.size}`;
      if (props.languages.length === 2) {
        const other =
          props.languages.find((l) => l.code !== props.current) ??
          props.languages[0];
        return h(
          'button',
          {
            type: 'button',
            class: button,
            lang: other.code,
            onClick: () => emit('update:current', other.code),
          },
          [globe(), other.name],
        );
      }
      const active = props.languages.find((l) => l.code === props.current);
      return h(DropdownMenuRoot, null, () => [
        h(DropdownMenuTrigger, { class: button }, () => [
          globe(),
          h(
            'span',
            { class: 'ui-visually-hidden' },
            `${props.label ?? uiLabels.value.language}: `,
          ),
          h('span', { lang: active?.code }, active?.name),
        ]),
        h(DropdownMenuPortal, null, () =>
          h(
            DropdownMenuContent,
            {
              side: 'bottom',
              align: 'start',
              sideOffset: 0,
              class: 'ui-menu',
              style: { zIndex: 'var(--ui-layer-popover)' },
            },
            () =>
              h(
                DropdownMenuRadioGroup,
                {
                  modelValue: props.current,
                  'onUpdate:modelValue': (code: unknown) =>
                    emit('update:current', String(code)),
                },
                () =>
                  props.languages.map((language) =>
                    h(
                      DropdownMenuRadioItem,
                      {
                        key: language.code,
                        value: language.code,
                        lang: language.code,
                        class: 'ui-menu__item',
                      },
                      () => language.name,
                    ),
                  ),
              ),
          ),
        ),
      ]);
    };
  },
});
