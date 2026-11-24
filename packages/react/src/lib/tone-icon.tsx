import type { IconName } from '@ghazal-ui/icons';
import { Icon } from './icon.js';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/** The icon for each tone. Shape tells the tones apart, not only colour. */
const TONE_ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

/** The tone's icon: an i, a tick, a warning sign or a cross. */
export function ToneIcon({
  tone,
  className,
}: {
  tone: AlertTone;
  className?: string;
}) {
  return <Icon name={TONE_ICONS[tone]} className={className} />;
}

/** The cross on close buttons. */
export function CloseIcon() {
  return <Icon name="x" size="sm" />;
}
