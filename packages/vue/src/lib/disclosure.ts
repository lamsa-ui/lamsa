import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui';
import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey,
  type PropType,
  type Ref,
} from 'vue';
import { Icon } from './content.js';

export type AccordionIcon = 'end' | 'start' | 'none';

const ACCORDION: InjectionKey<{
  icon: () => AccordionIcon;
  single: () => boolean;
}> = Symbol('accordion');

let closings = 0;

/** Close a <details> after its closing animation, so the content folds away instead of vanishing. */
function closeDetails(details: HTMLDetailsElement): void {
  if (!details.open || details.hasAttribute('data-closing')) return;
  const run = String(++closings);
  details.setAttribute('data-closing', run);
  const motion = details.getAnimations?.({ subtree: true }) ?? [];
  void Promise.allSettled(motion.map((a) => a.finished)).then(() => {
    if (details.getAttribute('data-closing') !== run) return;
    details.removeAttribute('data-closing');
    details.open = false;
  });
}

function showDetails(details: HTMLDetailsElement): void {
  details.removeAttribute('data-closing');
  details.open = true;
}

const sections = (group: HTMLElement) =>
  Array.from(group.querySelectorAll<HTMLDetailsElement>(':scope > details'));

export interface AccordionProps {
  /** Opening one section closes the others. */
  single?: boolean;
  icon?: AccordionIcon;
}

/** Sections that open and close, on native <details>. Up and down arrows move between headings. */
export const Accordion = defineComponent({
  name: 'UiAccordion',
  props: {
    single: Boolean,
    icon: { type: String as PropType<AccordionIcon>, default: 'end' },
  },
  setup(props, { slots }) {
    provide(ACCORDION, { icon: () => props.icon, single: () => props.single });
    const keydown = (event: KeyboardEvent) => {
      const group = event.currentTarget as HTMLElement;
      const summaries = sections(group).map((d) => d.querySelector('summary'));
      const i = summaries.indexOf(event.target as HTMLElement);
      if (i < 0 || event.defaultPrevented) return;
      const last = summaries.length - 1;
      const next = (
        {
          ArrowDown: i === last ? 0 : i + 1,
          ArrowUp: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        } as Record<string, number>
      )[event.key];
      if (next === undefined) return;
      event.preventDefault();
      summaries[next]?.focus();
    };
    return () =>
      h(
        'div',
        { class: 'ui-accordion', onKeydown: keydown },
        slots.default?.(),
      );
  },
});

export interface AccordionItemProps {
  heading?: string;
  description?: string;
  /** Bind with v-model:open to open and close it from code. */
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  /** Render the content only once it is first opened. */
  lazy?: boolean;
  /** With lazy: keep the content after it closes. */
  keep?: boolean;
  icon?: AccordionIcon;
}

/** One section of an accordion. The `#heading` slot replaces the heading text. */
export const AccordionItem = defineComponent({
  name: 'UiAccordionItem',
  props: {
    heading: String,
    description: String,
    open: { type: Boolean, default: undefined },
    defaultOpen: Boolean,
    disabled: Boolean,
    lazy: Boolean,
    keep: Boolean,
    icon: String as PropType<AccordionIcon>,
  },
  emits: { 'update:open': (_open: boolean) => true },
  setup(props, { emit, slots }) {
    const group = inject(ACCORDION, {
      icon: () => 'end' as const,
      single: () => false,
    });
    const own = ref<HTMLDetailsElement>();
    const initial = props.open ?? props.defaultOpen;
    const rendered = ref(initial);
    watch(
      () => props.open,
      (open) => {
        const el = own.value;
        if (!el || open === undefined || open === el.open) return;
        if (open) showDetails(el);
        else closeDetails(el);
      },
    );
    return () => {
      const icon = props.icon ?? group.icon();
      return h(
        'details',
        {
          ref: own,
          open: initial,
          class: [
            'ui-accordion__item',
            icon === 'start' && 'ui-accordion__item--icon-start',
            icon === 'none' && 'ui-accordion__item--no-icon',
          ],
          onToggle: (event: Event) => {
            const el = event.currentTarget as HTMLDetailsElement;
            if (!el.open) {
              if (!props.keep) rendered.value = false;
            } else {
              rendered.value = true;
              if (group.single() && el.parentElement)
                for (const other of sections(el.parentElement))
                  if (other !== el) closeDetails(other);
            }
            emit('update:open', el.open);
          },
        },
        [
          h(
            'summary',
            {
              'aria-disabled': props.disabled || undefined,
              onClick: (event: MouseEvent) => {
                const el = (event.currentTarget as HTMLElement)
                  .parentElement as HTMLDetailsElement;
                if (props.disabled) event.preventDefault();
                else if (el.hasAttribute('data-closing')) {
                  event.preventDefault();
                  showDetails(el);
                } else if (el.open) {
                  event.preventDefault();
                  closeDetails(el);
                }
              },
            },
            h('span', { class: 'ui-accordion__heading' }, [
              slots.heading?.() ?? props.heading,
              props.description
                ? h(
                    'span',
                    { class: 'ui-accordion__description' },
                    props.description,
                  )
                : null,
            ]),
          ),
          h(
            'div',
            { class: 'ui-accordion__content' },
            !props.lazy || rendered.value ? slots.default?.() : [],
          ),
        ],
      );
    };
  },
});

/** start and end follow the reading direction; Reka places by physical side. */
function side(placement: string, rtl: boolean) {
  if (placement === 'start') return rtl ? 'right' : 'left';
  if (placement === 'end') return rtl ? 'left' : 'right';
  return placement as 'top' | 'bottom';
}
const isRtl = () =>
  typeof document !== 'undefined' &&
  getComputedStyle(document.documentElement).direction === 'rtl';

export interface TooltipProps {
  /** A few words that name or explain the trigger. Never anything to act on. */
  text: string;
  placement?: 'top' | 'bottom' | 'start' | 'end';
}

/** A short label shown on hover and keyboard focus. The default slot is the trigger. */
export const Tooltip = defineComponent({
  name: 'UiTooltip',
  props: {
    text: { type: String, required: true },
    placement: {
      type: String as PropType<'top' | 'bottom' | 'start' | 'end'>,
      default: 'top',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(TooltipProvider, { delayDuration: 300 }, () =>
        h(TooltipRoot, null, () => [
          h(TooltipTrigger, { asChild: true }, () => slots.default?.()),
          h(TooltipPortal, null, () =>
            h(
              TooltipContent,
              {
                class: 'ui-tooltip',
                side: side(props.placement, isRtl()),
                sideOffset: 8,
                style: { zIndex: 'var(--ui-layer-tooltip)' },
              },
              () => props.text,
            ),
          ),
        ]),
      );
  },
});

export interface PopoverProps {
  placement?: 'bottom start' | 'top start' | 'bottom end' | 'top end';
}

/** Extra detail or a few controls that open from a button. `#trigger` is the button; the default slot is the content. */
export const Popover = defineComponent({
  name: 'UiPopover',
  props: {
    placement: {
      type: String as PropType<
        'bottom start' | 'top start' | 'bottom end' | 'top end'
      >,
      default: 'bottom start',
    },
  },
  setup(props, { slots }) {
    return () => {
      const [sideName, align] = props.placement.split(' ') as [
        'top' | 'bottom',
        'start' | 'end',
      ];
      return h(PopoverRoot, null, () => [
        h(PopoverTrigger, { asChild: true }, () => slots.trigger?.()),
        h(PopoverPortal, null, () =>
          h(
            PopoverContent,
            {
              class: 'ui-popover',
              side: sideName,
              align,
              sideOffset: 8,
              style: { zIndex: 'var(--ui-layer-popover)' },
            },
            () => slots.default?.(),
          ),
        ),
      ]);
    };
  },
});

/** Scroll buttons for a tab row that overflows, as in the React kit's tab strip. */
function useTabStrip(list: Ref<HTMLElement | undefined>) {
  const state = ref({ start: false, end: false });
  let stop = () => undefined as void;
  onMounted(() => {
    const el = list.value;
    if (!el) return;
    const update = () => {
      const travel = Math.abs(el.scrollLeft);
      const max = el.scrollWidth - el.clientWidth;
      state.value = { start: travel > 1, end: travel < max - 1 };
    };
    const center = () => {
      const tab = el.querySelector(
        '[aria-selected="true"], [aria-current="page"]',
      );
      if (!tab) return;
      const t = tab.getBoundingClientRect();
      const l = el.getBoundingClientRect();
      el.scrollBy?.({ left: t.left + t.width / 2 - (l.left + l.width / 2) });
    };
    const resize =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    resize?.observe(el);
    const mutations = new MutationObserver((records) => {
      if (records.some((r) => r.type === 'attributes')) center();
      update();
    });
    mutations.observe(el, {
      childList: true,
      subtree: true,
      attributeFilter: ['aria-selected', 'aria-current'],
    });
    el.addEventListener('scroll', update, { passive: true });
    center();
    update();
    stop = () => {
      resize?.disconnect();
      mutations.disconnect();
      el.removeEventListener('scroll', update);
    };
  });
  onBeforeUnmount(() => stop());
  const scroll = (toward: -1 | 1) => {
    const el = list.value;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: toward * (rtl ? -1 : 1) * el.clientWidth * 0.8 });
  };
  const button = (toward: 'start' | 'end') =>
    state.value.start || state.value.end
      ? h(
          'button',
          {
            type: 'button',
            class: 'ui-tabs__scroll',
            tabindex: -1,
            'aria-hidden': 'true',
            disabled: !state.value[toward],
            onClick: () => scroll(toward === 'start' ? -1 : 1),
          },
          h(Icon, {
            name: toward === 'start' ? 'chevron-left' : 'chevron-right',
          }),
        )
      : null;
  return { button };
}

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  /** Keep the panel mounted once visited, so what was typed stays. */
  keep?: boolean;
}

export interface TabsProps {
  /** Names the tab list. */
  label: string;
  tabs: readonly TabItem[];
  /** The selected tab's id. Bind with v-model:selected. */
  selected?: string;
}

/**
 * Views of the same thing, one at a time. Each panel comes from a slot named after its
 * tab's id (`#details`, `#history`). Arrow keys move between tabs and skip disabled ones.
 */
export const Tabs = defineComponent({
  name: 'UiTabs',
  props: {
    label: { type: String, required: true },
    tabs: { type: Array as PropType<readonly TabItem[]>, required: true },
    selected: String,
  },
  emits: { 'update:selected': (_id: string) => true },
  setup(props, { emit, slots }) {
    const list = ref<HTMLElement>();
    const strip = useTabStrip(list);
    const own = ref(
      props.selected ?? props.tabs.find((t) => !t.disabled)?.id ?? '',
    );
    const visited = ref(new Set([own.value]));
    watch(
      () => props.selected,
      (id) => {
        if (id === undefined) return;
        own.value = id;
        visited.value.add(id);
      },
    );
    return () =>
      h(
        TabsRoot,
        {
          class: 'ui-tabs',
          modelValue: own.value,
          activationMode: 'automatic',
          'onUpdate:modelValue': (id: string | number) => {
            own.value = String(id);
            visited.value.add(String(id));
            emit('update:selected', String(id));
          },
        },
        () => [
          h('div', { class: 'ui-tabs__bar' }, [
            strip.button('start'),
            h(
              TabsList,
              {
                ref: (el: unknown) => {
                  list.value = ((el as { $el?: HTMLElement })?.$el ??
                    undefined) as HTMLElement | undefined;
                },
                'aria-label': props.label,
                class: 'ui-tabs__list',
              },
              () =>
                props.tabs.map((tab) =>
                  h(
                    TabsTrigger,
                    {
                      key: tab.id,
                      value: tab.id,
                      disabled: tab.disabled,
                      class: 'ui-tab',
                    },
                    () => tab.label,
                  ),
                ),
            ),
            strip.button('end'),
          ]),
          ...props.tabs.map((tab) =>
            h(
              TabsContent,
              {
                key: tab.id,
                value: tab.id,
                class: 'ui-tabs__panel',
                forceMount:
                  (!!tab.keep && visited.value.has(tab.id)) || undefined,
                style: own.value === tab.id ? undefined : { display: 'none' },
              },
              () => slots[tab.id]?.(),
            ),
          ),
        ],
      );
  },
});

export interface TabNavProps {
  /** Names the navigation landmark. */
  label: string;
}

/** Tabs that are links to pages. Put `<a class="ui-tab">` children; mark the current one aria-current="page". */
export const TabNav = defineComponent({
  name: 'UiTabNav',
  props: { label: { type: String, required: true } },
  setup(props, { slots }) {
    const list = ref<HTMLElement>();
    const strip = useTabStrip(list);
    return () =>
      h('nav', { 'aria-label': props.label, class: 'ui-tabs__bar' }, [
        strip.button('start'),
        h('div', { ref: list, class: 'ui-tabs__list' }, slots.default?.()),
        strip.button('end'),
      ]);
  },
});
