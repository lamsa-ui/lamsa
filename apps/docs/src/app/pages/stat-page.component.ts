import { Component } from '@angular/core';
import { CardComponent, StatComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-stat-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    StatComponent,
    CardComponent,
  ],
  template: `
    <app-page
      title="Stat"
      lead="One number with its label, and how it changed. The change is written out, with its sign or in words; the arrow and the colour only repeat it."
      [usage]="usage"
    >
      <app-example
        title="A row of stats"
        description="Tone is set apart from the arrow, because up is not always good: rising costs go up in red."
        [code]="row"
      >
        <div
          class="grid w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4"
        >
          <ui-card>
            <ui-stat
              label="Revenue"
              value="EGP 84,200"
              change="+12% on last month"
              trend="up"
              tone="positive"
            />
          </ui-card>
          <ui-card>
            <ui-stat
              label="Costs"
              value="EGP 31,900"
              change="+8% on last month"
              trend="up"
              tone="negative"
            />
          </ui-card>
          <ui-card>
            <ui-stat
              label="Orders"
              value="1,204"
              change="Same as last month"
              trend="flat"
            />
          </ui-card>
        </div>
      </app-example>

      <app-example title="Number only" [code]="plain">
        <ui-stat label="Open tickets" value="7" />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-stat
          label="الإيرادات"
          value="٨٤٬٢٠٠ جنيه"
          change="+١٢٪ عن الشهر الماضي"
          trend="up"
          tone="positive"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class StatPageComponent {
  protected readonly usage = {
    angular: `import { StatComponent } from '@lamsa-ui/angular';`,
    react: `import { Stat } from '@lamsa-ui/react';`,
    vue: `import { Stat } from '@lamsa-ui/vue';`,
    html: `<div class="ui-stat">...</div>`,
  };

  protected readonly row = {
    angular: `<div class="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
  <ui-card>
    <ui-stat label="Revenue" value="EGP 84,200"
      change="+12% on last month" trend="up" tone="positive" />
  </ui-card>
  <ui-card>
    <ui-stat label="Costs" value="EGP 31,900"
      change="+8% on last month" trend="up" tone="negative" />
  </ui-card>
  <ui-card>
    <ui-stat label="Orders" value="1,204"
      change="Same as last month" trend="flat" />
  </ui-card>
</div>`,
    react: `<div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
  <Card>
    <Stat label="Revenue" value="EGP 84,200"
      change="+12% on last month" trend="up" tone="positive" />
  </Card>
  <Card>
    <Stat label="Costs" value="EGP 31,900"
      change="+8% on last month" trend="up" tone="negative" />
  </Card>
  <Card>
    <Stat label="Orders" value="1,204"
      change="Same as last month" trend="flat" />
  </Card>
</div>`,
    vue: `<div class="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
  <Card>
    <Stat label="Revenue" value="EGP 84,200"
      change="+12% on last month" trend="up" tone="positive" />
  </Card>
  <Card>
    <Stat label="Costs" value="EGP 31,900"
      change="+8% on last month" trend="up" tone="negative" />
  </Card>
  <Card>
    <Stat label="Orders" value="1,204"
      change="Same as last month" trend="flat" />
  </Card>
</div>`,
    html: `<div class="ui-card">
  <div class="ui-stat">
    <p class="ui-stat__label">Revenue</p>
    <p class="ui-stat__value">EGP 84,200</p>
    <p class="ui-stat__change ui-stat__change--positive">
      <i class="ui-icon ui-icon-arrow-up" aria-hidden="true"></i>
      +12% on last month
    </p>
  </div>
</div>`,
  };

  protected readonly plain = {
    angular: `<ui-stat label="Open tickets" value="7" />`,
    react: `<Stat label="Open tickets" value="7" />`,
    vue: `<Stat label="Open tickets" value="7" />`,
    html: `<div class="ui-stat">
  <p class="ui-stat__label">Open tickets</p>
  <p class="ui-stat__value">7</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-stat label="الإيرادات" value="٨٤٬٢٠٠ جنيه"
  change="+١٢٪ عن الشهر الماضي" trend="up" tone="positive" />`,
    react: `<Stat label="الإيرادات" value="٨٤٬٢٠٠ جنيه"
  change="+١٢٪ عن الشهر الماضي" trend="up" tone="positive" />`,
    vue: `<Stat label="الإيرادات" value="٨٤٬٢٠٠ جنيه"
  change="+١٢٪ عن الشهر الماضي" trend="up" tone="positive" />`,
    html: `<div class="ui-stat">
  <p class="ui-stat__label">الإيرادات</p>
  <p class="ui-stat__value">٨٤٬٢٠٠ جنيه</p>
  <p class="ui-stat__change ui-stat__change--positive">+١٢٪ عن الشهر الماضي</p>
</div>`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. What the number counts.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Required. The number, already formatted with its unit.',
    },
    {
      name: 'change',
      type: 'string',
      description: 'How it changed, readable on its own: "+12% on last month".',
    },
    {
      name: 'trend',
      type: "'up' | 'down' | 'flat'",
      description: 'The arrow beside the change.',
    },
    {
      name: 'tone',
      type: "'positive' | 'negative' | 'neutral'",
      default: "'neutral'",
      description:
        'Green, red or grey for the change. Set it by meaning, not by direction.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A level against a limit, such as 70% of storage',
      use: 'Meter',
      path: '/components/meter',
    },
    {
      need: 'Several label and value pairs',
      use: 'Property list',
      path: '/components/property-list',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: this.shared,
    vue: this.shared,
    html: [
      {
        name: 'ui-stat',
        type: 'class',
        description:
          'Required. Label, value and change stack in that order, which is also the reading order.',
      },
      {
        name: 'ui-stat__label | __value | __change',
        type: 'class',
        description: 'The three lines.',
      },
      {
        name: 'ui-stat__change--positive | --negative',
        type: 'class',
        description: 'The colour of the change. Put aria-hidden on its arrow.',
      },
    ],
  };
}
