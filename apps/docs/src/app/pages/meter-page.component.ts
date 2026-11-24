import { Component } from '@angular/core';
import { MeterComponent } from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-meter-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    MeterComponent,
  ],
  template: `
    <app-page
      title="Meter"
      lead="A level inside a known range: storage used, a plan's limit, a score. It is not work in progress, that is Progress. The value is written next to the label, so the tone colour only repeats what the words say."
      [usage]="usage"
    >
      <app-example
        title="Levels"
        description="You choose the tone from the value: the meter does not guess what is good or bad."
        [code]="levels"
      >
        <div class="grid w-full max-w-md gap-5">
          <ui-meter
            label="Storage"
            [value]="7.2"
            [max]="10"
            valueText="7.2 of 10 GB"
            tone="warning"
          />
          <ui-meter
            label="Orders this month"
            [value]="182"
            [max]="500"
            valueText="182 of 500"
          />
          <ui-meter label="Delivery score" [value]="94" tone="success" />
          <ui-meter
            label="SMS credit"
            [value]="3"
            valueText="3 left"
            tone="danger"
          />
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <div class="grid w-full max-w-md gap-5">
          <ui-meter
            label="المساحة"
            [value]="72"
            valueText="٧٫٢ من ١٠ جيجابايت"
            tone="warning"
          />
        </div>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class MeterPageComponent {
  protected readonly usage = {
    angular: `import { MeterComponent } from '@lamsa-ui/angular';`,
    react: `import { Meter } from '@lamsa-ui/react';`,
    vue: `import { Meter } from '@lamsa-ui/vue';`,
    html: `<div class="ui-meter">…<div class="ui-meter__bar" role="meter">…</div></div>`,
  };

  protected readonly levels = {
    angular: `<ui-meter label="Storage" [value]="7.2" [max]="10" valueText="7.2 of 10 GB" tone="warning" />
<ui-meter label="Orders this month" [value]="182" [max]="500" valueText="182 of 500" />
<ui-meter label="Delivery score" [value]="94" tone="success" />
<ui-meter label="SMS credit" [value]="3" valueText="3 left" tone="danger" />`,
    react: `<Meter label="Storage" value={7.2} max={10} valueText="7.2 of 10 GB" tone="warning" />
<Meter label="Orders this month" value={182} max={500} valueText="182 of 500" />
<Meter label="Delivery score" value={94} tone="success" />
<Meter label="SMS credit" value={3} valueText="3 left" tone="danger" />`,
    vue: `<Meter label="Storage" :value="7.2" :max="10" value-text="7.2 of 10 GB" tone="warning" />
<Meter label="Orders this month" :value="182" :max="500" value-text="182 of 500" />
<Meter label="Delivery score" :value="94" tone="success" />
<Meter label="SMS credit" :value="3" value-text="3 left" tone="danger" />`,
    html: `<div class="ui-meter ui-meter--warning">
  <div class="ui-meter__head">
    <span class="ui-meter__label" id="storage">Storage</span>
    <span class="ui-meter__value" aria-hidden="true">7.2 of 10 GB</span>
  </div>
  <div class="ui-meter__bar" role="meter" aria-labelledby="storage"
       aria-valuenow="7.2" aria-valuemin="0" aria-valuemax="10" aria-valuetext="7.2 of 10 GB">
    <span class="ui-meter__fill" style="--ui-meter-value: 72%"></span>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-meter label="المساحة" [value]="72" valueText="٧٫٢ من ١٠ جيجابايت" tone="warning" />`,
    react: `<Meter label="المساحة" value={72} valueText="٧٫٢ من ١٠ جيجابايت" tone="warning" />`,
    vue: `<Meter label="المساحة" :value="72" value-text="٧٫٢ من ١٠ جيجابايت" tone="warning" />`,
    html: `<div class="ui-meter ui-meter--warning">…</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Work that is still going, such as an upload',
      use: 'Progress',
      path: '/components/progress',
    },
    {
      need: 'One number and how it changed',
      use: 'Stat',
      path: '/components/stat',
    },
    {
      need: 'A value the reader sets',
      use: 'Slider',
      path: '/components/slider',
    },
  ];

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. What is measured.',
    },
    {
      name: 'value',
      type: 'number',
      description: 'Required. The level now, between min and max.',
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'The lowest level.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'The highest level.',
    },
    {
      name: 'valueText',
      type: 'string',
      description:
        'The value in words, shown and read: "7.2 of 10 GB". Defaults to a percentage.',
    },
    {
      name: 'tone',
      type: "'neutral' | 'success' | 'warning' | 'danger'",
      default: "'neutral'",
      description: 'Colour of the fill. You decide it from the value.',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: this.shared,
    vue: this.shared,
    html: [
      {
        name: 'ui-meter',
        type: 'class',
        description:
          'The wrapper. Tones: ui-meter--success, --warning, --danger.',
      },
      {
        name: 'ui-meter__bar',
        type: 'class',
        description:
          'The track: role="meter", aria-labelledby, aria-valuenow/min/max and aria-valuetext.',
      },
      {
        name: '--ui-meter-value',
        type: 'CSS length',
        description: 'On ui-meter__fill: how full, as a percentage.',
      },
    ],
  };
}
