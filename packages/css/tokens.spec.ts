import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Reads every `--ui-*: light-dark(#light, #dark)` token from ui.css. */
const css = readFileSync(join(import.meta.dirname, 'ui.css'), 'utf8');
const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /--ui-([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/g,
    ),
  ].map(([, name, light, dark]) => [name, { light, dark }]),
) as Record<string, { light: string; dark: string }>;

// Small text needs 7:1; borders, focus rings and large text need 3:1.
const pairs: [foreground: string, background: string, min: number][] = [
  ['text', 'bg', 7],
  ['text', 'surface', 7],
  ['text-muted', 'surface', 7],
  ['on-primary', 'primary', 7],
  ['on-secondary', 'secondary', 7],
  ['on-danger', 'danger', 7],
  ['on-highlight', 'highlight', 7],
  ['danger', 'surface', 7],
  ['danger', 'danger-soft', 7],
  ['on-success', 'success', 7],
  ['success', 'success-soft', 7],
  ['on-warning', 'warning', 7],
  ['warning', 'warning-soft', 7],
  ['text-muted', 'bg', 7],
  ['primary', 'bg', 7],
  // Alert and toast: body text on the soft tones.
  ['text', 'success-soft', 7],
  ['text', 'warning-soft', 7],
  ['text', 'danger-soft', 7],
  ['border', 'surface', 3],
  ['focus', 'bg', 3],
  // Graphics: the info icon on its fill, the progress fill on its track, a switch knob.
  ['primary', 'highlight', 3],
  ['primary', 'secondary', 3],
  ['border', 'bg', 3],
];

describe('design tokens', () => {
  it('reads every token from ui.css', () => {
    expect(Object.keys(tokens).length).toBeGreaterThanOrEqual(22);
  });

  for (const theme of ['light', 'dark'] as const) {
    it.each(pairs)(
      `${theme}: --ui-%s on --ui-%s reaches %d:1`,
      (fg, bg, min) => {
        expect(
          contrast(tokens[fg][theme], tokens[bg][theme]),
        ).toBeGreaterThanOrEqual(min);
      },
    );
  }
});

describe('spacing utilities', () => {
  const steps = [...css.matchAll(/^ {2}--ui-space-([\d-]+):/gm)].map(
    ([, n]) => n,
  );
  const prefixes = ['p', 'px', 'py', 'pt', 'pb', 'ps', 'pe'];
  const classes = [
    ...prefixes.flatMap((p) => [p, p.replace('p', 'm')]),
    'gap',
    'gap-x',
    'gap-y',
  ];

  it.each(steps)(
    'every padding, margin and gap class exists for step %s',
    (n) => {
      for (const c of classes) {
        expect(css).toContain(`.ui-${c}-${n} {`);
      }
    },
  );
});

describe('grid columns', () => {
  it.each(['', 'sm-', 'md-', 'lg-', 'xl-', '2xl-'])(
    'ui-col-%s1 to 12 exist',
    (bp) => {
      for (let n = 1; n <= 12; n++) {
        expect(css).toContain(`.ui-col-${bp}${n} {`);
      }
    },
  );
});

describe('Tailwind theme', () => {
  const bridge = readFileSync(
    join(import.meta.dirname, 'tailwind.css'),
    'utf8',
  );

  it('maps every colour token to a Tailwind colour', () => {
    const colours = [
      ...css.matchAll(/^ {2}--ui-([\w-]+):\s*(?:light-dark|#|rgb)/gm),
    ]
      .map(([, name]) => name)
      .filter((n) => !n.startsWith('shadow'));
    expect(colours.length).toBeGreaterThanOrEqual(25);
    for (const n of colours) {
      expect(bridge).toContain(`--color-${n}: var(--ui-${n});`);
    }
  });

  it('turns Tailwind classes into the kit tokens', async () => {
    const { default: postcss } = await import('postcss');
    const { default: tailwind } = await import('@tailwindcss/postcss');
    const from = join(import.meta.dirname, 'tailwind-check.css');
    const input = `@import 'tailwindcss' source(none);
@import './tailwind.css';
@source inline('p-4 p-0.5 bg-primary text-on-primary rounded-xl rounded-ui head-md z-dialog duration-fast ease-ui shadow-ui font-display md:p-6');`;
    const out = (await postcss([tailwind()]).process(input, { from })).css;
    /** The declarations of one class's rule in the output. */
    const rule = (cls: string) =>
      out.match(new RegExp(String.raw`\.${cls}\s*\{([^}]*)\}`))?.[1] ?? '';
    expect(rule('p-4')).toContain('calc(var(--ui-space-1) * 4)');
    expect(rule('bg-primary')).toContain('var(--ui-primary)');
    expect(rule('text-on-primary')).toContain('var(--ui-on-primary)');
    expect(rule('rounded-xl')).toContain('var(--ui-radius-xl)');
    expect(rule('rounded-ui')).toContain('var(--ui-radius)');
    expect(rule('head-md')).toContain('var(--ui-head-md)');
    expect(rule('z-dialog')).toContain('var(--ui-layer-dialog)');
    expect(rule('duration-fast')).toContain('var(--ui-duration-fast)');
    expect(rule('shadow-ui')).toContain('--ui-shadow');
    expect(out).toContain('@media (width >= 48rem)');
    // The kit itself is in the components layer, so a Tailwind utility wins over it.
    expect(out).toMatch(/@layer components\s*\{[\s\S]*\.ui-button\s*\{/);
  });
});
