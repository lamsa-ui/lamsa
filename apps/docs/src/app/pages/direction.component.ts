import { Component, computed, signal } from '@angular/core';
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

const langs = [
  {
    code: 'en',
    dir: 'ltr',
    name: 'English',
    crumbs: ['Home', 'Orders', 'Order 1042'],
    label: 'Breadcrumbs, English',
    toggle: 'Email me',
    note: 'Paid by card',
  },
  {
    code: 'ar',
    dir: 'rtl',
    name: 'العربية',
    crumbs: ['الرئيسية', 'الطلبات', 'الطلب ١٠٤٢'],
    label: 'مسار الصفحة',
    toggle: 'راسلني بالبريد',
    note: 'مدفوع بالبطاقة',
  },
];

@Component({
  selector: 'app-direction',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Right to left"
      lead="Arabic is a first language here. Set lang and dir on the page; every component turns by itself."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Logical properties</h2>
        <p>
          The kit writes start and end, never left and right. So should you.
        </p>
        <app-token-table
          label="Logical properties"
          tokenHeading="Write"
          valueHeading="Instead of"
          [rows]="logical"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the direction</h2>
        <p>
          The same markup; only <code>lang</code> and <code>dir</code> change.
        </p>
        <app-step
          label="Language"
          [max]="1"
          [valuetext]="lang().name"
          [(value)]="index"
        >
          <code>dir="{{ lang().dir }}"</code> · {{ lang().name }}
        </app-step>

        <app-example
          title="Breadcrumbs, switch and a start border"
          description="Separators, the switch knob and the start border all turn round."
          [code]="code()"
        >
          <div
            class="doc-direction__demo"
            [attr.lang]="lang().code"
            [attr.dir]="lang().dir"
          >
            <nav class="ui-breadcrumbs" [attr.aria-label]="lang().label">
              <ol>
                @for (c of lang().crumbs; track c; let last = $last) {
                  <li>
                    <span [attr.aria-current]="last ? 'page' : null">{{
                      c
                    }}</span>
                  </li>
                }
              </ol>
            </nav>
            <label class="ui-switch">
              <input
                class="ui-switch__input"
                type="checkbox"
                role="switch"
                checked
              />
              {{ lang().toggle }}
            </label>
            <p class="doc-block doc-direction__note">{{ lang().note }}</p>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What turns, what does not</h2>
        <p>Direction-free things keep their shape.</p>
        <app-token-table
          label="What turns around"
          tokenHeading="Turns around"
          valueHeading="Stays as is"
          useHeading="Why"
          [rows]="turns"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Never <code>ml-</code>, <code>pr-</code>, <code>left-</code>: they
            stay put in Arabic.
          </li>
          <li>Give a word in the other language its own <code>lang</code>.</li>
          <li>
            One kind of digit per product: <code>ar-EG</code> writes ١٠٤٢,
            <code>ar-EG-u-nu-latn</code> writes 1042.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class DirectionComponent {
  /** Starts in English. */
  protected readonly index = signal(0);
  protected readonly lang = computed(() => langs[this.index()]);

  protected readonly logical: TokenRow[] = [
    [
      'margin-inline-start',
      'margin-left',
      'ms-4',
      'Space before, on the reading side.',
    ],
    ['padding-inline-end', 'padding-right', 'pe-4', 'Space after.'],
    ['inset-inline-start', 'left', 'start-0', 'Position from the start edge.'],
    [
      'border-inline-start',
      'border-left',
      'border-s-4',
      'A start bar, like the side bar current link.',
    ],
    [
      'text-align: start',
      'text-align: left',
      'text-start',
      'Text follows the reading side.',
    ],
    [
      'scale: -1 1 on :dir(rtl)',
      'two icons',
      'rtl:-scale-x-100',
      'Mirror an arrow that points a way.',
    ],
  ].map(([token, value, tw, use]) => ({ token, value, tw, use }));

  protected readonly turns: TokenRow[] = [
    [
      'Text, padding, borders',
      'Logos and code',
      'Code is always left to right.',
    ],
    ['Back and next arrows', 'Check, clock, play', 'They do not point a way.'],
    ['Switch knob, drawers', 'Numbers', '1042 reads left to right in both.'],
  ].map(([token, value, use]) => ({ token, value, use }));

  protected readonly code = computed((): FrameworkCode => {
    const { code, dir } = this.lang();
    const html = `<html lang="${code}" dir="${dir}">
  <nav class="ui-breadcrumbs">…</nav>
  <label class="ui-switch">…</label>
</html>`;
    return {
      angular: html,
      react: html.replace(/class=/g, 'className='),
      html,
    };
  });
}
