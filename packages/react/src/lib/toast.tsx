'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button.js';
import { CloseIcon, ToneIcon, type AlertTone } from './tone-icon.js';
import { useUiLabels } from './labels.js';

export interface ToastOptions {
  tone?: AlertTone;
  /** A few words in bold before the message. */
  title?: string;
  /**
   * How long it stays, in milliseconds; 0 keeps it until it is closed. Defaults to
   * 6000, or 0 when there is an action, so nobody loses the action to a timer.
   */
  duration?: number;
  /** One button, such as Undo. Pressing it closes the toast. */
  action?: { label: string; run: () => void };
}

interface Toast extends ToastOptions {
  id: number;
  message: string;
}

interface ToastApi {
  /** Shows a toast and returns its id, for `dismiss()`. */
  show: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children?: ReactNode;
  /** The region's name; pass the translated text. */
  label?: string;
  /** The close buttons' name; pass the translated text. */
  closeLabel?: string;
}

/**
 * Holds the toasts for the app: put it once around the app, then call `useToast()`.
 * Screen readers hear each toast as it comes (danger at once, the rest politely), timers
 * pause while the pointer or focus is on a toast, and the region is a landmark.
 */
export function ToastProvider({
  children,
  label,
  closeLabel,
}: ToastProviderProps) {
  const t = useUiLabels();
  label ??= t.notifications;
  closeLabel ??= t.dismiss;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paused, setPaused] = useState(false);
  const [said, setSaid] = useState({ polite: '', assertive: '' });
  const nextId = useRef(0);

  const dismiss = useCallback(
    (id: number) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );
  const show = useCallback((message: string, options: ToastOptions = {}) => {
    const id = nextId.current++;
    setToasts((list) => [...list, { ...options, message, id }]);
    // Every other toast ends in a no-break space, so the same words twice still change the region.
    const text =
      [options.title, message].filter(Boolean).join('. ') +
      (id % 2 ? '\u00a0' : '');
    setSaid(
      options.tone === 'danger'
        ? { polite: '', assertive: text }
        : { polite: text, assertive: '' },
    );
    return id;
  }, []);

  // ponytail: a toast gets its full time again after a pause, not what was left; fine for 6 s notes.
  useEffect(() => {
    if (paused) return;
    const timers = toasts.map((toast) => {
      const duration = toast.duration ?? (toast.action ? 0 : 6000);
      return duration > 0
        ? setTimeout(() => dismiss(toast.id), duration)
        : undefined;
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, paused, dismiss]);

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Live regions that are always there, so screen readers hear what is put in them.
          Top layer: React Aria keeps them, and the toasts, reachable while a modal is open,
          and a click on a toast does not close the popover or dialog under it. */}
      <div
        className="ui-visually-hidden"
        aria-live="polite"
        data-react-aria-top-layer
      >
        {said.polite}
      </div>
      <div
        className="ui-visually-hidden"
        aria-live="assertive"
        data-react-aria-top-layer
      >
        {said.assertive}
      </div>
      {toasts.length > 0 &&
        createPortal(
          <section
            aria-label={label}
            data-react-aria-top-layer
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ol className="ui-toast-region">
              {toasts.map((toast) => (
                <li
                  key={toast.id}
                  className={`ui-alert ui-toast ui-alert--${toast.tone ?? 'info'}`}
                  data-testid="ui-toast"
                >
                  <ToneIcon
                    tone={toast.tone ?? 'info'}
                    className="ui-alert__icon"
                  />
                  <div className="ui-alert__body">
                    {toast.title && (
                      <p className="ui-alert__title">{toast.title}</p>
                    )}
                    <p>{toast.message}</p>
                    {toast.action && (
                      <div className="ui-alert__actions">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            toast.action?.run();
                            dismiss(toast.id);
                          }}
                        >
                          {toast.action.label}
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="ui-alert__close"
                    aria-label={closeLabel}
                    onClick={() => dismiss(toast.id)}
                  >
                    <CloseIcon />
                  </Button>
                </li>
              ))}
            </ol>
          </section>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/**
 * Shows short notes after an action. Needs a `ToastProvider` around the app.
 *
 * ```tsx
 * const toast = useToast();
 * toast.show('Address saved', { tone: 'success' });
 * ```
 */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api)
    throw new Error('useToast() needs a <ToastProvider> around the app.');
  return api;
}
