import { ICONS, MIRRORED_ICONS, type IconName } from '@lamsa-ui/icons';
import { defineComponent, h, mergeProps, ref, useId, type PropType } from 'vue';
import { useUiLabels } from './labels';

/** sm, md and lg, or any CSS length ('3rem'), or a number of pixels. */
export type IconSize = 'sm' | 'md' | 'lg' | number | (string & {});

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** What the icon means, for screen readers. Leave it out for a decorative icon. */
  label?: string;
}

/**
 * An icon that follows the text colour and the font size. Arrows and chevrons flip in
 * right-to-left pages. Without a `label` it is decoration and hidden from screen readers.
 */
export const Icon = defineComponent({
  name: 'UiIcon',
  inheritAttrs: false,
  props: {
    name: { type: String as PropType<IconName>, required: true },
    size: { type: [String, Number] as PropType<IconSize>, default: 'md' },
    label: String,
  },
  setup(props, { attrs }) {
    return () => {
      const preset = ['sm', 'md', 'lg'].includes(String(props.size));
      const custom = preset
        ? undefined
        : typeof props.size === 'number'
          ? `${props.size}px`
          : props.size;
      return h(
        'span',
        mergeProps(
          {
            role: props.label ? 'img' : undefined,
            'aria-label': props.label,
            'aria-hidden': props.label ? undefined : 'true',
          },
          attrs,
          {
            class: [
              'ui-icon',
              preset && props.size !== 'md' && `ui-icon--${props.size}`,
              MIRRORED_ICONS.includes(props.name) && 'ui-icon--mirror',
            ],
            style: custom ? { '--ui-icon-size': custom } : undefined,
          },
        ),
        // The markup comes from our own build-time constants, never from user input.
        h('svg', {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          innerHTML: ICONS[props.name],
        }),
      );
    };
  },
});

/** Keeps two Arabic initials apart, so ح and م never join into «حم». Invisible in Latin. */
const ZWNJ = '‌';

/** First letter of the first and last word: "Hatem Mohamed" → "HM", "حاتم محمد" → ح and م, kept apart. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = (word = '') => Array.from(word)[0] ?? '';
  const letters =
    words.length > 1
      ? first(words[0]) + ZWNJ + first(words[words.length - 1])
      : first(words[0]);
  return letters.toLocaleUpperCase();
}

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  /** The name is already on screen next to the avatar. */
  decorative?: boolean;
}

/** A person's photo, or their initials when there is no photo or it fails to load. */
export const Avatar = defineComponent({
  name: 'UiAvatar',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    src: String,
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    decorative: Boolean,
  },
  setup(props, { attrs }) {
    const failed = ref<string>();
    return () =>
      h(
        'span',
        mergeProps(attrs, {
          role: props.decorative ? undefined : 'img',
          'aria-label': props.decorative ? undefined : props.name,
          'aria-hidden': props.decorative ? 'true' : undefined,
          class: [
            'ui-avatar',
            props.size !== 'md' && `ui-avatar--${props.size}`,
          ],
        }),
        props.src && failed.value !== props.src
          ? h('img', {
              src: props.src,
              alt: '',
              onError: () => (failed.value = props.src),
            })
          : initials(props.name),
      );
  },
});

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Words in the middle of the line. Horizontal only. */
  label?: string;
}

/** A thin rule between groups of content; with a `label` ("or") the words sit in the middle. */
export const Divider = defineComponent({
  name: 'UiDivider',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    label: String,
  },
  setup(props, { attrs }) {
    return () =>
      props.label
        ? h(
            'div',
            mergeProps(attrs, { class: 'ui-divider ui-divider--label' }),
            props.label,
          )
        : h(
            'div',
            mergeProps(attrs, {
              role: 'separator',
              'aria-orientation':
                props.orientation === 'vertical' ? 'vertical' : undefined,
              class: [
                'ui-divider',
                props.orientation === 'vertical' && 'ui-divider--vertical',
              ],
            }),
          );
  },
});

export interface EmptyStateProps {
  title: string;
  /** Heading level of the title, so it fits the page's heading outline. */
  level?: 2 | 3 | 4;
}

/**
 * Shown where a list or table has nothing yet. The default slot explains why;
 * the `actions` slot holds the one action that fills it.
 */
export const EmptyState = defineComponent({
  name: 'UiEmptyState',
  inheritAttrs: false,
  props: {
    title: { type: String, required: true },
    level: { type: Number as PropType<2 | 3 | 4>, default: 3 },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h('div', mergeProps(attrs, { class: 'ui-empty-state' }), [
        h(`h${props.level}`, { class: 'ui-empty-state__title' }, props.title),
        slots.default?.(),
        slots.actions
          ? h('div', { class: 'ui-empty-state__actions' }, slots.actions())
          : null,
      ]);
  },
});

export type StatTrend = 'up' | 'down' | 'flat';
export type StatTone = 'positive' | 'negative' | 'neutral';

const TREND_ICONS: Record<StatTrend, IconName> = {
  up: 'arrow-up',
  down: 'arrow-down',
  flat: 'minus',
};

export interface StatProps {
  label: string;
  value: string;
  /** How it changed, in words or with a sign: "+12% on last month". */
  change?: string;
  trend?: StatTrend;
  /** The colour of the change: good, bad or neither. Up is not always good. */
  tone?: StatTone;
}

/** One number with its label, and how it changed. The arrow and colour only repeat the words. */
export const Stat = defineComponent({
  name: 'UiStat',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: String,
    trend: String as PropType<StatTrend>,
    tone: { type: String as PropType<StatTone>, default: 'neutral' },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', mergeProps(attrs, { class: 'ui-stat' }), [
        h('p', { class: 'ui-stat__label' }, props.label),
        h('p', { class: 'ui-stat__value' }, props.value),
        props.change
          ? h(
              'p',
              {
                class: [
                  'ui-stat__change',
                  props.tone !== 'neutral' && `ui-stat__change--${props.tone}`,
                ],
              },
              [
                props.trend
                  ? h(Icon, { name: TREND_ICONS[props.trend] })
                  : null,
                props.change,
              ],
            )
          : null,
      ]);
  },
});

export interface TagProps {
  /** First word of the remove button's name; the tag's text follows it. */
  removeLabel?: string;
}

/**
 * A label the user added or can take away, such as an active filter.
 * Listen to `@remove` to show the × button; then move focus to the next tag.
 */
export const Tag = defineComponent({
  name: 'UiTag',
  inheritAttrs: false,
  props: {
    removeLabel: String,
    onRemove: Function as PropType<() => void>,
  },
  setup(props, { attrs, slots }) {
    const uiLabels = useUiLabels();
    const id = useId();
    return () =>
      h('span', mergeProps(attrs, { class: 'ui-tag' }), [
        h('span', { id }, slots.default?.()),
        props.onRemove
          ? h(
              'button',
              {
                type: 'button',
                class: 'ui-tag__remove',
                id: `${id}-remove`,
                'aria-label': props.removeLabel ?? uiLabels.value.remove,
                'aria-labelledby': `${id}-remove ${id}`,
                onClick: () => props.onRemove?.(),
              },
              h(Icon, { name: 'x' }),
            )
          : null,
      ]);
  },
});

export type TimelineStatus = 'approved' | 'pending' | 'rejected';

export interface TimelineItem {
  title: string;
  date: string;
  /** Machine-readable date, such as "2026-11-20T14:30:00Z". */
  dateTime?: string;
  actor?: string;
  description?: string;
  status?: TimelineStatus;
  /** Overrides the status text shown to users, including for translation. */
  statusLabel?: string;
}

export interface TimelineProps {
  /** Names the history list: "Approval history". */
  label: string;
  items: readonly TimelineItem[];
}

const STATUS_ICONS: Record<TimelineStatus, IconName> = {
  approved: 'check',
  pending: 'clock',
  rejected: 'x',
};
/** A read-only, chronological record of decisions, such as a case's approval history. */
export const Timeline = defineComponent({
  name: 'UiTimeline',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    items: { type: Array as PropType<readonly TimelineItem[]>, required: true },
  },
  setup(props, { attrs }) {
    const uiLabels = useUiLabels();
    return () =>
      h(
        'ol',
        mergeProps(attrs, { class: 'ui-timeline', 'aria-label': props.label }),
        props.items.map((item) =>
          h('li', { class: 'ui-timeline__item' }, [
            h(
              'span',
              {
                class: [
                  'ui-timeline__marker',
                  item.status && `ui-timeline__marker--${item.status}`,
                ],
                'aria-hidden': 'true',
              },
              item.status ? [h(Icon, { name: STATUS_ICONS[item.status] })] : [],
            ),
            h('article', { class: 'ui-timeline__content' }, [
              h('div', { class: 'ui-timeline__heading' }, [
                h('h3', { class: 'ui-timeline__title' }, item.title),
                item.status
                  ? h(
                      'span',
                      {
                        class: [
                          'ui-timeline__status',
                          `ui-timeline__status--${item.status}`,
                        ],
                      },
                      item.statusLabel ?? uiLabels.value.timeline[item.status],
                    )
                  : null,
              ]),
              h('p', { class: 'ui-timeline__meta' }, [
                item.actor ? h('span', item.actor) : null,
                h('time', { datetime: item.dateTime }, item.date),
              ]),
              item.description
                ? h(
                    'p',
                    { class: 'ui-timeline__description' },
                    item.description,
                  )
                : null,
            ]),
          ]),
        ),
      );
  },
});

export interface BreadcrumbsProps {
  /** Names the landmark; pass the translated text. */
  label?: string;
}

/**
 * Where the page sits: a navigation landmark around a list. Put each link in an `<li>`;
 * the last item is the page itself, with `aria-current="page"` and no link.
 */
export const Breadcrumbs = defineComponent({
  name: 'UiBreadcrumbs',
  inheritAttrs: false,
  props: { label: String },
  setup(props, { attrs, slots }) {
    const uiLabels = useUiLabels();
    return () =>
      h(
        'nav',
        mergeProps(attrs, {
          'aria-label': props.label ?? uiLabels.value.breadcrumb,
          class: 'ui-breadcrumbs',
        }),
        h('ol', slots.default?.()),
      );
  },
});

export interface NavProps {
  /** Names the landmark, so it differs from other navigation on the page. */
  label: string;
}

/** The app's main links, in a side bar. Mark the current page's link `aria-current="page"`. */
export const Nav = defineComponent({
  name: 'UiNav',
  inheritAttrs: false,
  props: { label: { type: String, required: true } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'nav',
        mergeProps(attrs, { 'aria-label': props.label, class: 'ui-nav' }),
        slots.default?.(),
      );
  },
});

export interface AvatarPerson {
  name: string;
  src?: string;
}

export interface AvatarGroupProps {
  label: string;
  people: readonly AvatarPerson[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  moreLabel?: (count: number) => string;
}

/**
 * Several people in a small space: the first few avatars overlap, and "+3" stands for
 * the rest. Every avatar is still named, and the group has a name of its own.
 */
export const AvatarGroup = defineComponent({
  name: 'UiAvatarGroup',
  props: {
    label: { type: String, required: true },
    people: {
      type: Array as PropType<readonly AvatarPerson[]>,
      required: true,
    },
    max: { type: Number, default: 4 },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    moreLabel: Function as PropType<(count: number) => string>,
  },
  setup(props) {
    const uiLabels = useUiLabels();
    return () => {
      const rest = Math.max(props.people.length - props.max, 0);
      return h(
        'div',
        { class: 'ui-avatar-group', role: 'group', 'aria-label': props.label },
        [
          ...props.people.slice(0, props.max).map((person, i) =>
            h(Avatar, {
              key: i,
              name: person.name,
              src: person.src,
              size: props.size,
            }),
          ),
          ...(rest
            ? [
                h(
                  'span',
                  {
                    role: 'img',
                    'aria-label': (props.moreLabel ?? uiLabels.value.more)(
                      rest,
                    ),
                    class: [
                      'ui-avatar ui-avatar-group__more',
                      props.size !== 'md' && `ui-avatar--${props.size}`,
                    ],
                  },
                  `+${rest}`,
                ),
              ]
            : []),
        ],
      );
    };
  },
});
