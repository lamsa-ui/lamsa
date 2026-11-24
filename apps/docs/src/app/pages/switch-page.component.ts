import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-switch-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SwitchComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Switch"
      lead="An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox."
      [usage]="usage"
    >
      <app-example title="Settings" [code]="basic">
        <div class="doc-stack doc-field">
          <ui-switch
            label="Order updates"
            hint="A message to your phone when the driver is near."
            [formControl]="updates"
          />
          <ui-switch label="Offers" />
          <ui-switch label="Two-step sign in" [formControl]="locked" />
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-switch label="تحديثات الطلب" class="doc-field" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SwitchPageComponent {
  protected readonly updates = new FormControl(true, { nonNullable: true });
  protected readonly locked = new FormControl(
    { value: true, disabled: true },
    { nonNullable: true },
  );

  protected readonly usage = {
    angular: `import { SwitchComponent } from '@ghazal-ui/angular';
// The value is true or false. Works with formControlName, [formControl] and ngModel.`,
    react: `import { Switch } from '@ghazal-ui/react';
// Every other prop goes to the input: checked, onChange, name, ref.`,
    vue: `import { Switch } from '@ghazal-ui/vue';
// Bind it with v-model; every other attribute goes to the input: name, required.`,
    html: `<label class="ui-switch">
  Order updates
  <input type="checkbox" role="switch" class="ui-switch__input" />
</label>`,
  };

  protected readonly basic = {
    angular: `<ui-switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  formControlName="updates"
/>
<ui-switch label="Offers" formControlName="offers" />`,
    react: `<Switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  checked={updates}
  onChange={(e) => save({ updates: e.target.checked })}
/>`,
    vue: `<Switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  :checked="updates"
  @change="(e) => save({{ updates: e.target.checked }})"
/>`,
    html: `<div class="ui-field">
  <label class="ui-switch">
    Order updates
    <input type="checkbox" role="switch" class="ui-switch__input" aria-describedby="updates-hint" checked />
  </label>
  <p class="ui-field__hint" id="updates-hint">A message to your phone when the driver is near.</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-switch label="تحديثات الطلب" formControlName="updates" />`,
    react: `<Switch label="تحديثات الطلب" checked={updates} onChange={toggle} />`,
    vue: `<Switch label="تحديثات الطلب" :checked="updates" @change="toggle" />`,
    html: `<!-- dir="rtl" on the page or any ancestor: the knob moves the other way -->
<label class="ui-switch">
  تحديثات الطلب
  <input type="checkbox" role="switch" class="ui-switch__input" />
</label>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A choice sent with a form',
      use: 'Checkbox',
      path: '/components/checkbox',
    },
    {
      need: 'A pressed state in a toolbar, such as bold',
      use: 'Toggle',
      path: '/components/toggle',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The setting it turns on.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under it, read with the switch.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The setting it turns on.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under it, read with the switch.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
      {
        name: '...props',
        type: 'input props',
        description:
          'Every native input prop: checked, defaultChecked, onChange, disabled, ref.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The setting it turns on.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under it, read with the switch.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
    ],
    html: [
      {
        name: 'ui-switch',
        type: 'class',
        description: 'On the label: the text, then the input.',
      },
      {
        name: 'ui-switch__input',
        type: 'class',
        description: 'On an input type="checkbox" with role="switch".',
      },
    ],
  };
}
