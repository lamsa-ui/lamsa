import type { IconName } from '@lamsa-ui/icons';
import type { AlertTone } from '../dialog/alert-dialog';

/** The icon for each tone. Shape tells the tones apart, not only colour. */
export const TONE_ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};
