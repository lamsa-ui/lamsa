import { toSignal } from '@angular/core/rxjs-interop';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  StepComponent as UiStepComponent,
  StepperComponent,
  SwitchComponent,
  TextFieldComponent,
} from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent as DocStepComponent } from '../shared/step.component';

@Component({
  selector: 'app-stepper-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    StepperComponent,
    UiStepComponent,
    DocStepComponent,
    TextFieldComponent,
    SwitchComponent,
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <app-page
      title="Stepper"
      lead="A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change."
      [usage]="usage"
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try it</h2>
        <p>
          Change the options and the stepper follows. With linear, a step must
          be marked as filled in before Next or the later steps work.
        </p>
        <app-step
          label="Steps"
          [min]="2"
          [max]="6"
          [valuetext]="count() + ' steps'"
          [value]="count()"
          (valueChange)="setCount($event)"
          >{{ count() }} steps</app-step
        >

        <app-example
          title="Options"
          description="Turn linear on, then try to reach a later step before filling in the current one."
          [code]="simple"
        >
          <ui-switch label="Linear" [formControl]="linear" />
          <ui-stepper
            class="w-full"
            label="Options demo"
            [linear]="linearOn()"
            [(current)]="current"
          >
            @for (n of steps(); track n) {
              <ui-step [label]="'Step ' + n" [completed]="filled().has(n)">
                <ui-switch
                  [label]="'Step ' + n + ' is filled in'"
                  [ngModel]="filled().has(n)"
                  (ngModelChange)="fill(n, $event)"
                />
              </ui-step>
            }
          </ui-stepper>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the screen</h2>
        <p>
          Set the screen width: the stepper puts each name under its circle once
          its own box is under 30rem.
        </p>
        <app-step
          label="Screen width"
          [min]="20"
          [max]="60"
          [valuetext]="readout()"
          [(value)]="width"
          >{{ readout() }}</app-step
        >

        <app-example
          title="At any screen width"
          description="The same stepper in a box as wide as the slider says. It reads its own box, not the window."
          [code]="simple"
        >
          <div #stage class="doc-bp" [style.block-size.px]="height()">
            <div
              #frame
              class="doc-bp__frame ui-container"
              [style.inline-size.rem]="width()"
              [style.scale]="scale()"
            >
              <ui-stepper label="Screen demo" [current]="1">
                <ui-step label="Cart"><p>2 items.</p></ui-step>
                <ui-step label="Address"><p>Cairo.</p></ui-step>
                <ui-step label="Payment"><p>Cash on delivery.</p></ui-step>
                <ui-step label="Review"><p>Check your order.</p></ui-step>
              </ui-stepper>
            </div>
          </div>
        </app-example>
      </section>

      <app-example
        title="Checkout, in order"
        description="A whole flow. The address and card steps are completed once their fields are valid; press Next with them empty to see the errors. Finish places the order."
        [code]="basic"
      >
        @if (placed()) {
          <div class="doc-field">
            <p>
              Order placed. A receipt is on its way to
              {{ address.controls.email.value }}.
            </p>
            <button
              ui-button
              variant="secondary"
              type="button"
              (click)="startOver()"
            >
              Start over
            </button>
          </div>
        } @else {
          <ui-stepper
            class="w-full"
            label="Checkout"
            linear
            [(current)]="step"
            (blocked)="showErrors($event)"
            (finish)="placed.set(true)"
          >
            <ui-step label="Cart">
              <p>2 items, EGP 1,250.</p>
            </ui-step>
            <ui-step label="Address" [completed]="address.valid">
              <div class="doc-field" [formGroup]="address">
                <ui-text-field
                  label="Full name"
                  autocomplete="name"
                  formControlName="name"
                  [error]="
                    address.controls.name.invalid &&
                    address.controls.name.touched
                      ? 'Enter your full name'
                      : undefined
                  "
                />
                <ui-text-field
                  label="Email"
                  type="email"
                  autocomplete="email"
                  formControlName="email"
                  [error]="
                    address.controls.email.invalid &&
                    address.controls.email.touched
                      ? 'Enter an email like name@example.com'
                      : undefined
                  "
                />
              </div>
            </ui-step>
            <ui-step label="Payment" [completed]="card.valid">
              <ui-text-field
                class="doc-field"
                label="Card number"
                hint="16 digits"
                autocomplete="cc-number"
                [formControl]="card"
                [error]="
                  card.invalid && card.touched
                    ? 'Enter the 16 digits on your card'
                    : undefined
                "
              />
            </ui-step>
            <ui-step label="Review">
              <p>
                2 items, EGP 1,250, for {{ address.controls.name.value }}. Press
                Finish to place the order.
              </p>
            </ui-step>
          </ui-stepper>
        }
      </app-example>

      <app-example
        title="In Arabic"
        description="Without linear, every step can be chosen. Translate the button labels and Done."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-stepper
          class="w-full"
          label="إتمام الطلب"
          doneLabel="تم"
          backLabel="السابق"
          nextLabel="التالي"
          finishLabel="إنهاء"
          [number]="arabicDigits"
          [current]="2"
        >
          <ui-step label="السلة"><p>منتجان.</p></ui-step>
          <ui-step label="العنوان"><p>القاهرة.</p></ui-step>
          <ui-step label="الدفع"><p>الدفع عند الاستلام.</p></ui-step>
          <ui-step label="المراجعة"><p>راجع طلبك.</p></ui-step>
        </ui-stepper>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class StepperPageComponent {
  protected readonly address = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected readonly card = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{16}$/)],
  });
  protected readonly step = signal(0);
  protected readonly placed = signal(false);

  protected showErrors(i: number): void {
    if (i === 1) this.address.markAllAsTouched();
    if (i === 2) this.card.markAsTouched();
  }

  protected startOver(): void {
    this.address.reset();
    this.card.reset();
    this.step.set(0);
    this.placed.set(false);
  }

  // The options demo.
  protected readonly linear = new FormControl(false, { nonNullable: true });
  protected readonly linearOn = toSignal(this.linear.valueChanges, {
    initialValue: false,
  });
  protected readonly count = signal(4);
  protected readonly current = signal(0);
  protected readonly steps = computed(() =>
    Array.from({ length: this.count() }, (_, i) => i + 1),
  );
  protected readonly filled = signal<ReadonlySet<number>>(new Set());

  protected setCount(n: number): void {
    this.count.set(n);
    if (this.current() >= n) this.current.set(n - 1);
  }

  protected fill(n: number, on: boolean): void {
    const next = new Set(this.filled());
    if (on) next.add(n);
    else next.delete(n);
    this.filled.set(next);
  }

  // The screen-width demo: a box as wide as the slider, scaled down to fit the page.
  protected readonly width = signal(24);
  protected readonly readout = computed(
    () => `Screen ${this.width()}rem (${this.width() * 16}px)`,
  );
  protected readonly scale = signal(1);
  protected readonly height = signal<number | null>(null);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      const frame = this.frame().nativeElement;
      const fit = () => {
        const s = Math.min(1, stage.clientWidth / frame.offsetWidth);
        this.scale.set(s);
        this.height.set(frame.offsetHeight * s);
      };
      fit();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(fit);
      observer.observe(stage);
      observer.observe(frame);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
  protected readonly arabicDigits = (n: number) => n.toLocaleString('ar-EG');

  protected readonly usage = {
    angular: `import { StepComponent, StepperComponent } from '@ghazal-ui/angular';`,
    react: `import { Stepper } from '@ghazal-ui/react';`,
    vue: `import { Stepper } from '@ghazal-ui/vue';`,
    html: `<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">...</ol>
  <section class="ui-stepper__panel">...</section>
  <div class="ui-stepper__actions">...</div>
</div>`,
  };

  protected readonly simple = {
    angular: `<ui-stepper label="Checkout" [linear]="linear" [(current)]="step">
  <ui-step label="Step 1" [completed]="done1">…</ui-step>
  <ui-step label="Step 2" [completed]="done2">…</ui-step>
</ui-stepper>`,
    react: `<Stepper label="Checkout" linear={linear}
  steps={[
    { label: 'Step 1', content: …, completed: done1 },
    { label: 'Step 2', content: …, completed: done2 },
  ]} />`,
    vue: `<Stepper label="Checkout" :linear="linear"
  :steps="[
    { label: 'Step 1', completed: done1 },
    { label: 'Step 2', completed: done2 },
  ]">
  <template #panel="{ index }">…</template>
</Stepper>`,
    html: `<div class="ui-stepper">…</div>`,
  };

  protected readonly basic = {
    angular: `<ui-stepper label="Checkout" linear
  [(current)]="step"
  (blocked)="showErrors($event)"
  (finish)="placeOrder()">
  <ui-step label="Cart">…</ui-step>
  <ui-step label="Address" [completed]="address.valid">
    <ui-text-field label="Full name" formControlName="name"
      [error]="name.invalid && name.touched ? 'Enter your full name' : undefined" />
    <ui-text-field label="Email" type="email" formControlName="email" />
  </ui-step>
  <ui-step label="Payment" [completed]="card.valid">
    <ui-text-field label="Card number" [formControl]="card" />
  </ui-step>
  <ui-step label="Review">…</ui-step>
</ui-stepper>`,
    react: `<Stepper
  label="Checkout"
  linear
  onBlocked={() => setTouched(true)}
  onFinish={placeOrder}
  steps={[
    { label: 'Cart', content: <Cart /> },
    { label: 'Address', content: <Address />, completed: name !== '' },
    { label: 'Payment', content: <Payment /> },
    { label: 'Review', content: <Review /> },
  ]}
/>`,
    vue: `<Stepper
  label="Checkout"
  linear
  :steps="[
    { label: 'Cart' },
    { label: 'Address', completed: name !== '' },
    { label: 'Payment' },
    { label: 'Review' },
  ]"
  @blocked="touched = true"
  @finish="placeOrder"
>
  <template #panel="{ index }">
    <Cart v-if="index === 0" />
    <Address v-else-if="index === 1" />
    <Payment v-else-if="index === 2" />
    <Review v-else />
  </template>
</Stepper>`,
    html: `<!-- You move between steps with your own script: set the classes,
     aria-current, hidden and disabled, and focus the new panel. -->
<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">
    <li class="ui-steps__item ui-steps__item--done">
      <button type="button" class="ui-steps__step" id="step-1">
        <span class="ui-steps__marker" aria-hidden="true"><i class="ui-icon ui-icon-check"></i></span>
        <span class="ui-steps__label"><span class="ui-visually-hidden">Done: </span>Cart</span>
      </button>
    </li>
    <li class="ui-steps__item ui-steps__item--current">
      <button type="button" class="ui-steps__step" id="step-2" aria-current="step">
        <span class="ui-steps__marker" aria-hidden="true">2</span>
        <span class="ui-steps__label">Address</span>
      </button>
    </li>
    <li class="ui-steps__item">
      <button type="button" class="ui-steps__step" id="step-3" disabled>
        <span class="ui-steps__marker" aria-hidden="true">3</span>
        <span class="ui-steps__label">Payment</span>
      </button>
    </li>
  </ol>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-1" hidden>…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-2">…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-3" hidden>…</section>
  <div class="ui-stepper__actions">
    <button class="ui-button ui-button--secondary ui-button--md" type="button">Back</button>
    <button class="ui-button ui-button--primary ui-button--md" type="button">Next</button>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  [number]="arabicDigits" [current]="2">
  <ui-step label="السلة">…</ui-step>
  <ui-step label="العنوان">…</ui-step>
  <ui-step label="الدفع">…</ui-step>
  <ui-step label="المراجعة">…</ui-step>
</ui-stepper>

arabicDigits = (n: number) => n.toLocaleString('ar-EG');`,
    react: `<Stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  number={(n) => n.toLocaleString('ar-EG')}
  defaultCurrent={2}
  steps={[
    { label: 'السلة', content: … },
    { label: 'العنوان', content: … },
    { label: 'الدفع', content: … },
    { label: 'المراجعة', content: … },
  ]} />`,
    vue: `<Stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  :number="(n) => n.toLocaleString('ar-EG')"
  :model-value="2"
  :steps="[{ label: 'السلة' }, { label: 'العنوان' }, { label: 'الدفع' }, { label: 'المراجعة' }]">
  <template #panel="{ index }">…</template>
</Stepper>`,
    html: `<!-- dir="rtl" on the page: the steps run from the right -->
<div class="ui-stepper">…</div>`,
  };

  private readonly labels = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the list of steps: "Checkout".',
    },
    {
      name: 'linear',
      type: 'boolean',
      default: 'false',
      description:
        'Each step waits for the ones before it to be completed, and Next waits for the current one.',
    },
    {
      name: 'doneLabel',
      type: 'string',
      default: "'Done' from labels",
      description: 'Read before each done step. Translate it.',
    },
    {
      name: 'backLabel | nextLabel | finishLabel',
      type: 'string',
      default: "'Back' | 'Next' | 'Finish' from labels",
      description: 'The button labels. Translate them.',
    },
    {
      name: 'number',
      type: '(n: number) => string',
      default: 'String',
      description: "The marker's number, for Arabic digits.",
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Views the reader can open in any order',
      use: 'Tabs',
      path: '/components/tabs',
    },
    {
      need: 'Pages of a list',
      use: 'Pagination',
      path: '/components/pagination',
    },
    {
      need: 'What happened to a request, in time order',
      use: 'Timeline',
      path: '/components/timeline',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.labels,
      {
        name: 'current',
        type: 'number',
        default: '0',
        description: 'Index of the current step; two-way with [(current)].',
      },
      {
        name: '(blocked)',
        type: 'number',
        description:
          'Linear only: Next or Finish was pressed on this step while it is not completed. Show its errors.',
      },
      {
        name: '(finish)',
        type: 'void',
        description: 'Finish was pressed on the last step.',
      },
      {
        name: 'ui-step label',
        type: 'string',
        description: "Required. The step's name; its content goes inside.",
      },
      {
        name: 'ui-step completed',
        type: 'boolean',
        default: 'true',
        description:
          'Whether the step is filled in, such as its form being valid. A step before the current one shows a tick only when it is.',
      },
    ],
    react: [
      ...this.labels,
      {
        name: 'steps',
        type: '{ label, content, completed? }[]',
        description:
          'Required. Each step stays mounted while hidden, so what was typed is kept. completed defaults to true.',
      },
      {
        name: 'current | defaultCurrent',
        type: 'number',
        default: '0',
        description: 'Index of the current step, controlled or not.',
      },
      {
        name: 'onChange',
        type: '(index: number) => void',
        description: 'The current step changed.',
      },
      {
        name: 'onBlocked',
        type: '(index: number) => void',
        description:
          'Linear only: Next or Finish was pressed on this step while it is not completed.',
      },
      {
        name: 'onFinish',
        type: '() => void',
        description: 'Finish was pressed on the last step.',
      },
    ],
    vue: [
      ...this.labels,
      {
        name: 'steps',
        type: '{ label, completed? }[]',
        description:
          'Required. completed defaults to true; false keeps a linear stepper on it.',
      },
      {
        name: 'v-model',
        type: 'number',
        default: '0',
        description: 'Index of the current step.',
      },
      {
        name: '#panel',
        type: 'slot',
        description:
          'Renders each step from { index, step }. Hidden steps stay mounted, so what was typed is kept.',
      },
      {
        name: '@blocked',
        type: 'event',
        description:
          'Linear only: Next or Finish was pressed on a step that is not completed.',
      },
      {
        name: '@finish',
        type: 'event',
        description: 'Finish was pressed on the last step.',
      },
    ],
    html: [
      {
        name: 'ui-stepper',
        type: 'class',
        description: 'Wraps the list, the panels and the buttons.',
      },
      {
        name: 'ui-steps',
        type: 'class',
        description: 'On the ol. Give it an aria-label.',
      },
      {
        name: 'ui-steps__item--done | --current',
        type: 'class',
        description:
          'Per li. Put aria-current="step" on the current button, and "Done: " in a ui-visually-hidden span on done ones.',
      },
      {
        name: 'ui-steps__step',
        type: 'class',
        description:
          'The button in each li. Disable it while the step cannot be reached.',
      },
      {
        name: 'ui-steps__marker | __label',
        type: 'class',
        description: 'The circle (aria-hidden) and the name.',
      },
      {
        name: 'ui-stepper__panel | __actions',
        type: 'class',
        description:
          'One panel per step, hidden except the current one, with tabindex="-1" so focus can move to it; then the Back and Next row.',
      },
    ],
  };
}
