import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';
import { buildTheme, checks, normalizeHex, themeCss } from '../shared/theme';

const PRESETS = [
  { name: 'Lamsa blue', hex: '#0059ff' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Forest', hex: '#15803d' },
  { name: 'Amber', hex: '#d97706' },
];

@Component({
  selector: 'app-theme-builder',
  imports: [PageComponent, CodeBlockComponent, DecimalPipe],
  template: `
    <app-page
      title="Theme builder"
      lead="Re-brand the kit for a client with one colour. The builder darkens it along its own hue until white text on it reaches 7:1 for the light theme, and lightens it until ink text reaches 7:1 for the dark one, the same way the kit's own blue was made. Every pair the kit's contrast test checks is measured below."
    >
      <section class="doc-card" aria-labelledby="pick">
        <h2 class="doc-card__title" id="pick">The client's colour</h2>
        <div class="flex flex-wrap items-end gap-4">
          <div class="ui-field">
            <label class="ui-field__label" for="brand-picker">Pick</label>
            <input
              id="brand-picker"
              type="color"
              class="doc-colour"
              [value]="brand()"
              (input)="pick($any($event.target).value)"
            />
          </div>
          <div class="ui-field doc-field">
            <label class="ui-field__label" for="brand-hex">Or type a hex</label>
            <input
              id="brand-hex"
              class="ui-input"
              spellcheck="false"
              autocomplete="off"
              [value]="typed()"
              [attr.aria-invalid]="valid() ? null : true"
              [attr.aria-describedby]="valid() ? null : 'brand-hex-error'"
              (input)="type($any($event.target).value)"
            />
            @if (!valid()) {
              <p class="ui-field__error" id="brand-hex-error" role="alert">
                Write six hex digits, such as #0059ff.
              </p>
            }
          </div>
        </div>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Examples">
          @for (preset of presets; track preset.hex) {
            <button
              type="button"
              class="ui-button ui-button--secondary ui-button--sm"
              [attr.aria-pressed]="brand() === preset.hex"
              (click)="pick(preset.hex)"
            >
              <span
                class="doc-swatch"
                aria-hidden="true"
                [style.background]="preset.hex"
              ></span>
              {{ preset.name }}
            </button>
          }
        </div>
      </section>

      <section class="doc-card" aria-labelledby="preview">
        <h2 class="doc-card__title" id="preview">Preview</h2>
        <div class="doc-theme-preview" [style]="vars()">
          @for (mode of modes; track mode.id) {
            <div
              class="doc-theme-preview__pane"
              [attr.data-theme]="mode.id"
              role="group"
              [attr.aria-label]="mode.label"
            >
              <p class="ui-label">{{ mode.label }}</p>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="ui-button ui-button--primary">
                  Place order
                </button>
                <button type="button" class="ui-button ui-button--soft">
                  Save draft
                </button>
              </div>
              <label class="ui-switch">
                Text me updates
                <input
                  type="checkbox"
                  role="switch"
                  class="ui-switch__input"
                  checked
                />
              </label>
              <div
                class="ui-segmented"
                role="radiogroup"
                [attr.aria-label]="'Period, ' + mode.label"
              >
                @for (p of periods; track p) {
                  <label class="ui-segmented__option">
                    <input
                      type="radio"
                      [name]="'period-' + mode.id"
                      [checked]="p === 'Week'"
                    />{{ p }}
                  </label>
                }
              </div>
              <ul
                class="ui-listbox doc-flat"
                role="listbox"
                [attr.aria-label]="'City, ' + mode.label"
              >
                <li class="ui-option" role="option" aria-selected="false">
                  Alexandria
                </li>
                <li
                  class="ui-option ui-option--active"
                  role="option"
                  aria-selected="true"
                >
                  Cairo
                </li>
              </ul>
              <progress
                class="ui-progress__bar"
                max="100"
                value="60"
                [attr.aria-label]="'Upload, ' + mode.label"
              ></progress>
              <p><a href="#theme-css">A link in the text</a></p>
            </div>
          }
        </div>
      </section>

      <section class="doc-card" aria-labelledby="checks">
        <h2 class="doc-card__title" id="checks">Contrast</h2>
        <p class="doc-card__text">
          Small text needs 7:1; focus rings and graphics need 3:1. These are the
          same pairs the kit's unit test checks, so a theme that passes here
          passes there.
        </p>
        <div
          class="ui-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Contrast of each pair"
        >
          <table class="ui-table">
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col">Needs</th>
                <th scope="col">Light</th>
                <th scope="col">Dark</th>
              </tr>
            </thead>
            <tbody>
              @for (c of results(); track c.pair) {
                <tr>
                  <th scope="row">{{ c.pair }}</th>
                  <td>{{ c.min }}:1</td>
                  <td>
                    {{ c.light | number: '1.1-1' }}:1
                    <span
                      class="ui-badge"
                      [class.ui-badge--success]="c.light >= c.min"
                      [class.ui-badge--danger]="c.light < c.min"
                      >{{ c.light >= c.min ? 'Pass' : 'Fail' }}</span
                    >
                  </td>
                  <td>
                    {{ c.dark | number: '1.1-1' }}:1
                    <span
                      class="ui-badge"
                      [class.ui-badge--success]="c.dark >= c.min"
                      [class.ui-badge--danger]="c.dark < c.min"
                      >{{ c.dark >= c.min ? 'Pass' : 'Fail' }}</span
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-card" aria-labelledby="theme-css">
        <h2 class="doc-card__title" id="theme-css">The CSS</h2>
        <p class="doc-card__text">
          Put it after the kit's stylesheet. Tailwind classes and every
          component follow. The dark value is the darkest tint that passes; a
          lighter one, as the kit's own #8fb4ff, passes too. Danger stays red.
        </p>
        <button
          type="button"
          class="ui-button ui-button--secondary ui-button--sm"
          (click)="downloadCss()"
        >
          Download theme.css
        </button>
        <app-code-block caption="CSS" [text]="css()" />
      </section>
    </app-page>
  `,
})
export class ThemeBuilderComponent {
  protected readonly presets = PRESETS;
  protected readonly periods = ['Day', 'Week', 'Month'];
  protected readonly modes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
  ];
  protected readonly brand = signal('#0059ff');
  protected readonly typed = signal('#0059ff');
  protected readonly valid = computed(() => !!normalizeHex(this.typed()));
  protected readonly theme = computed(() => buildTheme(this.brand()));
  protected readonly results = computed(() => checks(this.theme()));
  protected readonly css = computed(() => themeCss(this.theme()));
  protected readonly vars = computed(() => {
    const t = this.theme();
    const pair = (v: { light: string; dark: string }) =>
      `light-dark(${v.light}, ${v.dark})`;
    return {
      '--ui-primary': pair(t.primary),
      '--ui-on-primary': pair(t.onPrimary),
      '--ui-focus': pair(t.primary),
      '--ui-highlight': pair(t.highlight),
      '--ui-on-highlight': pair(t.onHighlight),
    };
  });

  protected pick(hex: string): void {
    this.brand.set(hex);
    this.typed.set(hex);
  }

  protected type(text: string): void {
    this.typed.set(text);
    const hex = normalizeHex(text);
    if (hex) this.brand.set(hex);
  }

  protected downloadCss(): void {
    const url = URL.createObjectURL(
      new Blob([this.css()], { type: 'text/css;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lamsa-theme.css';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
