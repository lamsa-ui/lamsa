/**
 * Builds a client's primary colour set the way the kit built its own: the brand colour,
 * darkened (light theme) or lightened (dark theme) along its own hue until small text on it
 * reaches 7:1. Grounds and text stay the kit's.
 */

export const INK = '#0b1020';
export const PAPER = '#f6f7fb';
export const WHITE = '#ffffff';
const SECONDARY = { light: '#e4e7f2', dark: '#232a45' };
const SURFACE = { light: '#ffffff', dark: '#151b30' };

/** WCAG 2.x relative luminance of a `#rrggbb` colour, as packages/css/tokens.spec.ts measures it. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** `#abc` or `#aabbcc` (any case) to `#aabbcc`, or null. */
export function normalizeHex(text: string): string | null {
  const t = text.trim().toLowerCase().replace(/^#?/, '#');
  if (/^#[0-9a-f]{6}$/.test(t)) return t;
  if (/^#[0-9a-f]{3}$/.test(t))
    return '#' + [...t.slice(1)].map((c) => c + c).join('');
  return null;
}

type Hsl = [h: number, s: number, l: number];

function toHsl(hex: string): Hsl {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r
      ? (g - b) / d + (g < b ? 6 : 0)
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return [h * 60, s * 100, l * 100];
}

function toHex([h, s, l]: Hsl): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return (
    '#' +
    [f(0), f(8), f(4)]
      .map((c) =>
        Math.round(Math.max(0, Math.min(1, c)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** Moves lightness by `step` until `ok` holds, or lightness runs out. */
function walk(start: Hsl, step: number, ok: (hex: string) => boolean): string {
  const [h, s] = start;
  for (let l = start[2]; l >= 0 && l <= 100; l += step) {
    const hex = toHex([h, s, l]);
    if (ok(hex)) return hex;
  }
  return toHex([h, s, step < 0 ? 0 : 100]);
}

export interface ThemeColours {
  primary: { light: string; dark: string };
  onPrimary: { light: string; dark: string };
  highlight: { light: string; dark: string };
  onHighlight: { light: string; dark: string };
}

export function buildTheme(brand: string): ThemeColours {
  const hsl = toHsl(brand);
  const [h, s] = hsl;
  // Primary carries white text on light, ink text on dark, and is 7:1 against the page.
  const light = walk(
    hsl,
    -0.5,
    (c) => contrast(WHITE, c) >= 7 && contrast(c, PAPER) >= 7,
  );
  const dark = walk(hsl, 0.5, (c) => contrast(INK, c) >= 7);
  // Highlight: a pale tint (light) or deep shade (dark) of the same hue, for selected rows.
  const highlightLight = walk(
    [h, Math.min(s, 90), 92],
    0.5,
    (c) => contrast(INK, c) >= 7 && contrast(light, c) >= 3,
  );
  const highlightDark = walk(
    [h, Math.min(s, 65), 32],
    -0.5,
    (c) => contrast(PAPER, c) >= 7 && contrast(dark, c) >= 3,
  );
  return {
    primary: { light, dark },
    onPrimary: { light: WHITE, dark: INK },
    highlight: { light: highlightLight, dark: highlightDark },
    onHighlight: { light: INK, dark: PAPER },
  };
}

export interface ContrastCheck {
  pair: string;
  min: number;
  light: number;
  dark: number;
}

/** The pairs packages/css/tokens.spec.ts checks that involve the colours made here. */
export function checks(t: ThemeColours): ContrastCheck[] {
  const both = (
    pair: string,
    min: number,
    fg: { light: string; dark: string },
    bg: { light: string; dark: string },
  ): ContrastCheck => ({
    pair,
    min,
    light: contrast(fg.light, bg.light),
    dark: contrast(fg.dark, bg.dark),
  });
  const page = { light: PAPER, dark: INK };
  return [
    both('on-primary on primary', 7, t.onPrimary, t.primary),
    both('primary on the page (links)', 7, t.primary, page),
    both('on-highlight on highlight', 7, t.onHighlight, t.highlight),
    both('focus ring on the page', 3, t.primary, page),
    both('focus ring on a surface', 3, t.primary, SURFACE),
    both('primary on highlight (graphics)', 3, t.primary, t.highlight),
    both('primary on secondary (tracks)', 3, t.primary, SECONDARY),
  ];
}

export function themeCss(t: ThemeColours): string {
  const pair = (v: { light: string; dark: string }) =>
    `light-dark(${v.light}, ${v.dark})`;
  return `:root {
  --ui-primary: ${pair(t.primary)};
  --ui-on-primary: ${pair(t.onPrimary)};
  --ui-focus: ${pair(t.primary)};
  --ui-highlight: ${pair(t.highlight)};
  --ui-on-highlight: ${pair(t.onHighlight)};
}`;
}
