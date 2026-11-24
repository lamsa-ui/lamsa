import { Component } from '@angular/core';
import { FieldsetComponent, TextFieldComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-fieldset-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    FieldsetComponent,
    TextFieldComponent,
  ],
  template: `
    <app-page
      title="Fieldset"
      lead="A titled group of fields inside a longer form. Screen readers read the legend as they enter the group, so a field called Street is heard as part of the delivery address."
      [usage]="usage"
    >
      <app-example title="An address" [code]="basic">
        <fieldset
          ui-fieldset
          legend="Delivery address"
          hint="Where the driver should go."
          class="doc-field"
        >
          <ui-text-field label="Street" autocomplete="address-line1" />
          <ui-text-field label="City" autocomplete="address-level2" />
        </fieldset>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <fieldset ui-fieldset legend="عنوان التوصيل" class="doc-field">
          <ui-text-field label="الشارع" />
          <ui-text-field label="المدينة" />
        </fieldset>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class FieldsetPageComponent {
  protected readonly usage = {
    angular: `import { FieldsetComponent } from '@lamsa-ui/angular';
// An attribute on a native fieldset: <fieldset ui-fieldset legend="…">`,
    react: `import { Fieldset } from '@lamsa-ui/react';`,
    vue: `import { Fieldset } from '@lamsa-ui/vue';`,
    html: `<fieldset class="ui-fieldset">
  <legend class="ui-fieldset__legend">Delivery address</legend>
  …fields
</fieldset>`,
  };

  protected readonly basic = {
    angular: `<fieldset ui-fieldset legend="Delivery address" hint="Where the driver should go.">
  <ui-text-field label="Street" autocomplete="address-line1" formControlName="street" />
  <ui-text-field label="City" autocomplete="address-level2" formControlName="city" />
</fieldset>`,
    react: `<Fieldset legend="Delivery address" hint="Where the driver should go.">
  <TextField label="Street" autoComplete="address-line1" />
  <TextField label="City" autoComplete="address-level2" />
</Fieldset>`,
    vue: `<Fieldset legend="Delivery address" hint="Where the driver should go.">
  <TextField label="Street" autoComplete="address-line1" />
  <TextField label="City" autoComplete="address-level2" />
</Fieldset>`,
    html: `<fieldset class="ui-fieldset" aria-describedby="address-hint">
  <legend class="ui-fieldset__legend">Delivery address</legend>
  <p class="ui-field__hint" id="address-hint">Where the driver should go.</p>
  <div class="ui-field">…Street</div>
  <div class="ui-field">…City</div>
</fieldset>`,
  };

  protected readonly arabic = {
    angular: `<fieldset ui-fieldset legend="عنوان التوصيل">…</fieldset>`,
    react: `<Fieldset legend="عنوان التوصيل">…</Fieldset>`,
    vue: `<Fieldset legend="عنوان التوصيل">…</Fieldset>`,
    html: `<!-- dir="rtl" on the page or any ancestor; the markup is the same -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A frame around content that is not a form',
      use: 'Card',
      path: '/components/card',
    },
    {
      need: 'One choice from a few, with a group label',
      use: 'Radio group',
      path: '/components/radio-group',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'legend',
        type: 'string',
        description: 'Required. The group title.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'A line under the legend, read with the group.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'The native attribute: disables every field inside.',
      },
    ],
    react: [
      {
        name: 'legend',
        type: 'string',
        description: 'Required. The group title.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'A line under the legend, read with the group.',
      },
      {
        name: '...props',
        type: 'fieldset props',
        description: 'Every native fieldset prop, such as disabled.',
      },
    ],
    vue: [
      {
        name: 'legend',
        type: 'string',
        description: 'Required. The group title.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'A line under the legend, read with the group.',
      },
    ],
    html: [
      {
        name: 'ui-fieldset',
        type: 'class',
        description: 'On the fieldset; spaces the fields in it.',
      },
      {
        name: 'ui-fieldset__legend',
        type: 'class',
        description: 'On its legend.',
      },
    ],
  };
}
