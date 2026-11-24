import { Component, computed, signal } from '@angular/core';
import { markup } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

const durations = [
  ['--ui-duration-fast', '150ms', 'A change in place: the switch knob.'],
  ['--ui-duration', '250ms', 'Fades: dialog, backdrop, accordion arrow.'],
  ['--ui-duration-slow', '400ms', 'Panels that travel: drawer, sheet, toast.'],
].map(([token, value, use]) => ({
  token,
  value,
  use,
  tw: token
    .replace('--ui-duration', 'duration')
    .replace(/^duration$/, 'duration-ui'),
}));

@Component({
  selector: 'app-motion',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Motion"
      lead="Motion shows where something came from. Nothing over 400ms, nothing with reduced motion on."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tokens</h2>
        <p>Three durations and one curve, quick to start and soft to land.</p>
        <app-token-table label="Motion tokens" [rows]="rows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the durations</h2>
        <p>Pick a token, then press Play: all three move at that speed.</p>
        <app-step
          label="Duration"
          [max]="durations.length - 1"
          [valuetext]="duration().token + ', ' + duration().value"
          [(value)]="index"
        >
          <code>{{ duration().token }}</code> · {{ duration().value }}
        </app-step>

        <app-example
          title="Switch, panel and fade"
          [description]="duration().use"
          [code]="demoCode()"
        >
          <div
            class="doc-motion-demo"
            [class.doc-motion-demo--on]="moved()"
            [style.--doc-duration]="'var(' + duration().token + ')'"
          >
            <button
              type="button"
              class="ui-button ui-button--primary"
              [attr.aria-pressed]="moved()"
              (click)="moved.set(!moved())"
            >
              Play
            </button>
            <span class="doc-motion-demo__switch" aria-hidden="true">
              <span class="doc-motion-demo__knob"></span>
            </span>
            <span class="doc-motion-demo__track" aria-hidden="true">
              <span class="doc-motion-demo__panel">Panel</span>
            </span>
            <span class="doc-motion-demo__fade doc-block" aria-hidden="true"
              >Fade</span
            >
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Animations</h2>
        <p>
          Ready-made entrances and feedback. Add the class when the element
          appears; press Replay to see each one again.
        </p>
        <button
          type="button"
          class="ui-button ui-button--secondary"
          (click)="replay()"
        >
          Replay
        </button>
        <div class="doc-anim-grid">
          @for (a of animations; track a.cls) {
            <div class="doc-anim-card">
              <div class="doc-anim-card__stage">
                @if (run()) {
                  @if (a.cls === 'ui-anim-stagger') {
                    <div
                      class="ui-anim-stagger doc-anim-bars"
                      aria-hidden="true"
                    >
                      <span></span><span></span><span></span><span></span>
                    </div>
                  } @else if (a.cls === 'ui-anim-ping') {
                    <span class="doc-anim-dot" aria-hidden="true">
                      <span class="ui-anim-ping doc-anim-dot__ring"></span>
                    </span>
                  } @else {
                    <span [class]="'doc-anim-chip ' + a.cls">Lamsa</span>
                  }
                }
              </div>
              <code>{{ a.cls }}</code>
              <span class="doc-anim-card__use">{{ a.use }}</span>
            </div>
          }
        </div>
        <p>
          All of them stop under reduced motion. Loops (ping, shimmer) are for
          waiting, never decoration.
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Animate opacity, transform and colour; never size or position.
          </li>
          <li>Reduced motion stops everything; the spinner holds still.</li>
          <li>Closing never waits for an animation.</li>
        </ul>
      </section>
    </app-page>
  `,
})
export class MotionComponent {
  protected readonly durations = durations;
  protected readonly rows: TokenRow[] = [
    ...durations,
    {
      token: '--ui-ease',
      value: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      use: 'Every transition. Loading loops run linear at their own speed.',
      tw: 'ease-ui',
    },
  ];

  protected readonly animations = [
    ['ui-anim-fade-in', 'Content that appears in place.'],
    ['ui-anim-slide-up', 'Menus, cards and list items entering.'],
    ['ui-anim-slide-down', 'Banners and dropdowns from above.'],
    ['ui-anim-slide-start', 'Side panels; flips in right-to-left.'],
    ['ui-anim-scale-in', 'Popovers and tooltips.'],
    ['ui-anim-pop', 'Confirm a change: a badge count, a saved tick.'],
    ['ui-anim-shake', 'An invalid field or a refused action.'],
    ['ui-anim-stagger', 'Children enter one after another (up to 8).'],
    ['ui-anim-ping', 'A live or new indicator; loops.'],
    ['ui-anim-shimmer', 'A loading sweep over a placeholder; loops.'],
  ].map(([cls, use]) => ({ cls, use }));
  protected readonly run = signal(true);
  protected replay(): void {
    this.run.set(false);
    setTimeout(() => this.run.set(true), 50);
  }

  protected readonly moved = signal(false);
  /** Starts at --ui-duration. */
  protected readonly index = signal(1);
  protected readonly duration = computed(() => durations[this.index()]);
  protected readonly demoCode = computed(() =>
    markup(
      `<div class="translate-x-0 transition-transform ${this.durations[this.index()].token.replace('--ui-duration', 'duration').replace(/^duration$/, 'duration-ui')} ease-ui motion-reduce:transition-none">
  Panel
</div>`,
    ),
  );
}
