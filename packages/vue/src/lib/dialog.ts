import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import {
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  shallowRef,
  useId,
  type PropType,
} from 'vue';
import type { AlertTone, ButtonVariant } from './components.js';
import { Icon } from './content.js';

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogVariant = 'default' | 'alert' | 'drawer' | 'sheet';

export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  size?: DialogSize;
  /** drawer slides in from the inline end; sheet rises from the bottom. */
  variant?: DialogVariant;
  /** Escape and a click on the backdrop close it. False turns both off together. */
  dismissable?: boolean;
  role?: 'dialog' | 'alertdialog';
  closeLabel?: string;
}

/** Tracks whether an element scrolls, so a scrolling body can take focus and the keyboard can scroll it. */
function useOverflow() {
  const scrolls = ref(false);
  let observer: ResizeObserver | undefined;
  const bind = (el: unknown) => {
    observer?.disconnect();
    if (!(el instanceof HTMLElement)) return;
    const check = () => (scrolls.value = el.scrollHeight > el.clientHeight + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    observer = new ResizeObserver(check);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer?.observe(child));
  };
  onBeforeUnmount(() => observer?.disconnect());
  return { scrolls, bind };
}

/**
 * A modal dialog: title, optional description, body (default slot), `#actions` and `#icon`.
 * Bind it with `v-model:open`. Focus is trapped inside and goes back to the opener on close.
 * An alert dialog (`role="alertdialog"`) closes only by its buttons.
 */
export const Dialog = defineComponent({
  name: 'UiDialog',
  props: {
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    description: String,
    size: { type: String as PropType<DialogSize>, default: 'md' },
    variant: { type: String as PropType<DialogVariant>, default: 'default' },
    dismissable: { type: Boolean, default: true },
    role: {
      type: String as PropType<'dialog' | 'alertdialog'>,
      default: 'dialog',
    },
    closeLabel: { type: String, default: 'Close' },
  },
  emits: { 'update:open': (_open: boolean) => true },
  setup(props, { emit, slots }) {
    const descriptionId = useId();
    const body = useOverflow();
    const closable = () => props.dismissable && props.role !== 'alertdialog';
    const keepOpen = (event: Event) => {
      if (!closable()) event.preventDefault();
    };
    // The alert dialog pattern starts focus on the safest answer, marked autofocus.
    const focusMarked = (event: Event) => {
      const marked = (event.target as HTMLElement | null)?.querySelector?.(
        '[autofocus]',
      ) as HTMLElement | null;
      if (marked) {
        event.preventDefault();
        marked.focus();
      }
    };

    return () =>
      h(
        DialogRoot,
        {
          open: props.open,
          // Reka asks to close on Escape and outside clicks; a dialog that is not
          // dismissable ignores that and closes only by its own buttons.
          'onUpdate:open': (open: boolean) => {
            if (open || closable()) emit('update:open', open);
          },
        },
        () =>
          h(DialogPortal, null, () =>
            h(DialogOverlay, { class: 'ui-dialog-backdrop' }, () =>
              h(
                DialogContent,
                {
                  role: props.role,
                  class: [
                    'ui-dialog',
                    props.size !== 'md' && `ui-dialog--${props.size}`,
                    props.variant !== 'default' &&
                      `ui-dialog--${props.variant}`,
                  ],
                  'aria-describedby': props.description
                    ? descriptionId
                    : undefined,
                  onEscapeKeyDown: keepOpen,
                  onPointerDownOutside: keepOpen,
                  onInteractOutside: keepOpen,
                  onOpenAutoFocus: focusMarked,
                },
                () => [
                  h('header', { class: 'ui-dialog__header' }, [
                    slots.icon?.(),
                    h('div', { class: 'ui-dialog__heading' }, [
                      h(
                        DialogTitle,
                        { class: 'ui-dialog__title' },
                        () => props.title,
                      ),
                      props.description
                        ? h(
                            DialogDescription,
                            {
                              class: 'ui-dialog__description',
                              id: descriptionId,
                            },
                            () => props.description,
                          )
                        : null,
                    ]),
                    closable()
                      ? h(
                          'button',
                          {
                            type: 'button',
                            class:
                              'ui-button ui-button--ghost ui-button--md ui-dialog__close',
                            'aria-label': props.closeLabel,
                            'data-testid': 'ui-dialog-close',
                            onClick: () => emit('update:open', false),
                          },
                          h(Icon, { name: 'x', size: 'sm' }),
                        )
                      : null,
                  ]),
                  slots.default
                    ? h(
                        'div',
                        {
                          ref: body.bind,
                          class: 'ui-dialog__body',
                          tabindex: body.scrolls.value ? 0 : undefined,
                        },
                        slots.default(),
                      )
                    : null,
                  slots.actions
                    ? h(
                        'footer',
                        { class: 'ui-dialog__actions' },
                        slots.actions(),
                      )
                    : null,
                ],
              ),
            ),
          ),
      );
  },
});

export interface AlertAction<R> {
  label: string;
  value: R;
  variant?: ButtonVariant;
  /** Starts focus here; otherwise the first action that is not danger. */
  initialFocus?: boolean;
}

export interface AlertOptions<R> {
  title: string;
  message: string;
  tone?: AlertTone;
  actions: readonly AlertAction<R>[];
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
}

const TONE_ICONS = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
} as const;

function initialFocusIndex<R>(actions: readonly AlertAction<R>[]): number {
  const marked = actions.findIndex((a) => a.initialFocus);
  if (marked !== -1) return marked;
  const safe = actions.findIndex((a) => a.variant !== 'danger');
  return safe === -1 ? 0 : safe;
}

/**
 * A question that needs an answer before anything else: title, message and its buttons.
 * It closes only by a button. Most apps use `useAlertDialog()` instead.
 */
export const AlertDialog = defineComponent({
  name: 'UiAlertDialog',
  props: {
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    tone: String as PropType<AlertTone>,
    actions: {
      type: Array as PropType<readonly AlertAction<unknown>[]>,
      required: true,
    },
  },
  emits: { action: (_value: unknown) => true },
  setup(props, { emit }) {
    return () => {
      const focusIndex = initialFocusIndex(props.actions);
      return h(
        Dialog,
        {
          open: props.open,
          'onUpdate:open': (open: boolean) =>
            !open && emit('action', undefined),
          role: 'alertdialog',
          variant: 'alert',
          size: 'sm',
          title: props.title,
          description: props.message,
        },
        {
          icon: props.tone
            ? () =>
                h(
                  'span',
                  {
                    class: `ui-dialog__icon ui-dialog__icon--${props.tone}`,
                    'aria-hidden': 'true',
                  },
                  h(Icon, { name: TONE_ICONS[props.tone as AlertTone] }),
                )
            : undefined,
          actions: () =>
            props.actions.map((action, index) =>
              h(
                'button',
                {
                  key: index,
                  type: 'button',
                  class: `ui-button ui-button--${action.variant ?? 'secondary'} ui-button--md`,
                  autofocus: index === focusIndex || undefined,
                  'data-testid': `ui-alert-action-${index}`,
                  onClick: () => emit('action', action.value),
                },
                action.label,
              ),
            ),
        },
      );
    };
  },
});

/**
 * `alert()` and `confirm()` as promises, with the kit's alert dialog. Render the returned
 * `dialog` component once: `<component :is="dialog" />`.
 *
 * ```ts
 * const { confirm, dialog } = useAlertDialog();
 * if (await confirm({ title: 'Delete file?', message: '…', confirmLabel: 'Delete', danger: true })) remove();
 * ```
 */
export function useAlertDialog() {
  const request = shallowRef<{
    options: AlertOptions<unknown>;
    resolve: (value: unknown) => void;
  } | null>(null);

  const alert = <R>(options: AlertOptions<R>) =>
    new Promise<R | undefined>((resolve) => {
      request.value = {
        options: options as AlertOptions<unknown>,
        resolve: resolve as (value: unknown) => void,
      };
    });

  const confirm = async (options: ConfirmOptions) =>
    (await alert<boolean>({
      title: options.title,
      message: options.message,
      tone: options.danger ? 'danger' : undefined,
      actions: [
        {
          label: options.cancelLabel ?? 'Cancel',
          value: false,
          variant: 'secondary',
        },
        {
          label: options.confirmLabel,
          value: true,
          variant: options.danger ? 'danger' : 'primary',
          initialFocus: !options.danger,
        },
      ],
    })) === true;

  const dialog = defineComponent({
    name: 'UiAlertDialogHost',
    setup: () => () =>
      request.value
        ? h(AlertDialog, {
            open: true,
            ...request.value.options,
            onAction: (value: unknown) => {
              request.value?.resolve(value);
              request.value = null;
            },
          })
        : null,
  });

  return { alert, confirm, dialog };
}
