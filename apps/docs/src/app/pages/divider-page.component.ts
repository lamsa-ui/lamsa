import { Component } from '@angular/core';
import { ButtonComponent, DividerComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-divider-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    DividerComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Divider"
      lead="A thin line between groups of content. Reach for space first: a divider is for when space alone does not show where one group ends."
      [usage]="usage"
    >
      <app-example title="Between sections" [code]="line">
        <div class="grid w-full gap-4">
          <p class="doc-flat">Delivery: 30 EGP</p>
          <ui-divider />
          <p class="doc-flat">Total: 370 EGP</p>
        </div>
      </app-example>

      <app-example
        title="With words"
        description="The words are read as normal text, so a screen reader hears 'or' between the two choices."
        [code]="labelled"
      >
        <div class="grid w-full max-w-sm gap-4">
          <button ui-button variant="secondary" type="button">
            Sign in with a link
          </button>
          <ui-divider label="or" />
          <button ui-button variant="secondary" type="button">
            Sign in with a password
          </button>
        </div>
      </app-example>

      <app-example
        title="Vertical"
        description="Between items in a row. It stretches to the row's height."
        [code]="vertical"
      >
        <div class="flex items-center gap-3">
          <span>18 orders</span>
          <ui-divider orientation="vertical" />
          <span>3 in the kitchen</span>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <div class="grid w-full max-w-sm gap-4">
          <ui-divider label="أو" />
        </div>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class DividerPageComponent {
  protected readonly usage = {
    angular: `import { DividerComponent } from '@ghazal-ui/angular';`,
    react: `import { Divider } from '@ghazal-ui/react';`,
    vue: `import { Divider } from '@ghazal-ui/vue';`,
    html: `<hr class="ui-divider" />`,
  };

  protected readonly line = {
    angular: `<ui-divider />`,
    react: `<Divider />`,
    vue: `<Divider />`,
    html: `<hr class="ui-divider" />`,
  };

  protected readonly labelled = {
    angular: `<ui-divider label="or" />`,
    react: `<Divider label="or" />`,
    vue: `<Divider label="or" />`,
    html: `<div class="ui-divider ui-divider--label">or</div>`,
  };

  protected readonly vertical = {
    angular: `<div class="flex items-center gap-3">
  <span>18 orders</span>
  <ui-divider orientation="vertical" />
  <span>3 in the kitchen</span>
</div>`,
    react: `<div className="flex items-center gap-3">
  <span>18 orders</span>
  <Divider orientation="vertical" />
  <span>3 in the kitchen</span>
</div>`,
    vue: `<div class="flex items-center gap-3">
  <span>18 orders</span>
  <Divider orientation="vertical" />
  <span>3 in the kitchen</span>
</div>`,
    html: `<div class="flex items-center gap-3">
  <span>18 orders</span>
  <div class="ui-divider ui-divider--vertical" role="separator" aria-orientation="vertical"></div>
  <span>3 in the kitchen</span>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-divider label="أو" />`,
    react: `<Divider label="أو" />`,
    vue: `<Divider label="أو" />`,
    html: `<div class="ui-divider ui-divider--label">أو</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    { need: 'A frame around a group', use: 'Card', path: '/components/card' },
    { need: 'Space between groups', use: 'Tailwind gap or margin classes' },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which way the line runs.',
      },
      {
        name: 'label',
        type: 'string',
        description:
          'Words in the middle of the line, read as text. Horizontal only.',
      },
    ],
    react: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which way the line runs.',
      },
      {
        name: 'label',
        type: 'string',
        description:
          'Words in the middle of the line, read as text. Horizontal only.',
      },
      {
        name: '...props',
        type: 'div props',
        description: 'Every native div prop.',
      },
    ],
    vue: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which way the line runs.',
      },
      {
        name: 'label',
        type: 'string',
        description:
          'Words in the middle of the line, read as text. Horizontal only.',
      },
    ],
    html: [
      {
        name: 'ui-divider',
        type: 'class',
        description:
          'Required. On an hr it is a separator already; on a div add role="separator".',
      },
      {
        name: 'ui-divider--vertical',
        type: 'class',
        description: 'Vertical. Add aria-orientation="vertical".',
      },
      {
        name: 'ui-divider--label',
        type: 'class',
        description:
          'Words in the middle. No separator role, so the words are read.',
      },
    ],
  };
}
