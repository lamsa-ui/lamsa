import { Component } from '@angular/core';
import { ButtonComponent, ButtonGroupComponent } from '@ghazal-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-button-group-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    ButtonGroupComponent,
  ],
  template: `
    <app-page
      title="Button group"
      lead="Buttons that belong together, joined into one bar. The group has a name, so a screen reader says what the buttons are for before it reads them."
      [usage]="usage"
    >
      <app-example
        title="Actions on one thing"
        description="Each button is still a normal button: Tab reaches every one."
        [code]="actions"
      >
        <ui-button-group label="Invoice">
          <button ui-button variant="secondary" type="button">Download</button>
          <button ui-button variant="secondary" type="button">Print</button>
          <button ui-button variant="secondary" type="button">Email</button>
        </ui-button-group>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-button-group label="الفاتورة">
          <button ui-button variant="secondary" type="button">تنزيل</button>
          <button ui-button variant="secondary" type="button">طباعة</button>
        </ui-button-group>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ButtonGroupPageComponent {
  protected readonly usage = {
    angular: `import { ButtonComponent, ButtonGroupComponent } from '@ghazal-ui/angular';`,
    react: `import { Button, ButtonGroup } from '@ghazal-ui/react';`,
    vue: `import { Button, ButtonGroup } from '@ghazal-ui/vue';`,
    html: `<div class="ui-button-group" role="group" aria-label="Invoice">…</div>`,
  };

  protected readonly actions = {
    angular: `<ui-button-group label="Invoice">
  <button ui-button variant="secondary" type="button">Download</button>
  <button ui-button variant="secondary" type="button">Print</button>
  <button ui-button variant="secondary" type="button">Email</button>
</ui-button-group>`,
    react: `<ButtonGroup label="Invoice">
  <Button variant="secondary">Download</Button>
  <Button variant="secondary">Print</Button>
  <Button variant="secondary">Email</Button>
</ButtonGroup>`,
    vue: `<ButtonGroup label="Invoice">
  <Button variant="secondary">Download</Button>
  <Button variant="secondary">Print</Button>
  <Button variant="secondary">Email</Button>
</ButtonGroup>`,
    html: `<div class="ui-button-group" role="group" aria-label="Invoice">
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Download</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Print</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Email</button>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-button-group label="الفاتورة">
  <button ui-button variant="secondary" type="button">تنزيل</button>
  <button ui-button variant="secondary" type="button">طباعة</button>
</ui-button-group>`,
    react: `<ButtonGroup label="الفاتورة">
  <Button variant="secondary">تنزيل</Button>
  <Button variant="secondary">طباعة</Button>
</ButtonGroup>`,
    vue: `<ButtonGroup label="الفاتورة">
  <Button variant="secondary">تنزيل</Button>
  <Button variant="secondary">طباعة</Button>
</ButtonGroup>`,
    html: `<div class="ui-button-group" role="group" aria-label="الفاتورة">
  <button class="ui-button ui-button--secondary ui-button--md" type="button">تنزيل</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">طباعة</button>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One choice that changes the view',
      use: 'Segmented control',
      path: '/components/segmented-control',
    },
    {
      need: 'Many controls with arrow-key movement, as in an editor',
      use: 'Toolbar',
      path: '/components/toolbar',
    },
    {
      need: 'More actions than fit on a phone',
      use: 'Menu',
      path: '/components/menu',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. What the buttons do together, for screen readers.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. What the buttons do together, for screen readers.',
      },
      {
        name: '...props',
        type: 'div props',
        description: 'Every native div prop.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. What the buttons do together, for screen readers.',
      },
      {
        name: '#default',
        type: 'slot',
        description: 'The buttons.',
      },
    ],
    html: [
      {
        name: 'ui-button-group',
        type: 'class',
        description:
          'Joins the .ui-button children. Add role="group" and an aria-label.',
      },
    ],
  };
}
