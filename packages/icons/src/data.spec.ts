import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ICONS, MIRRORED_ICONS, searchIcon } from './data.js';

const svgDir = join(import.meta.dirname, '../svg');
const files = readdirSync(svgDir).filter((f) => f.endsWith('.svg'));

describe('icons', () => {
  it('has one entry per SVG file', () => {
    expect(Object.keys(ICONS).sort()).toEqual(
      files.map((f) => f.slice(0, -4)).sort(),
    );
  });

  it('holds markup without an outer svg wrapper', () => {
    for (const shapes of Object.values(ICONS)) {
      expect(shapes).toMatch(
        /^<(path|circle|rect|line|polyline|polygon|ellipse)\b/,
      );
      expect(shapes).not.toContain('<svg');
    }
  });

  it('exports each icon on its own for tree shaking', () => {
    expect(searchIcon).toBe(ICONS.search);
  });

  it('only mirrors icons that exist', () => {
    for (const name of MIRRORED_ICONS) expect(ICONS).toHaveProperty(name);
  });
});
