import { Component } from '@angular/core';
import { KbdComponent } from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-kbd-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    KbdComponent,
  ],
  template: `
    <app-page
      title="Keyboard key"
      lead="A key to press, on the native kbd element, so screen readers and search engines know it is a key. For a shortcut write one key per element, with the joining + as plain text."
      [usage]="usage"
    >
      <app-example title="A shortcut" [code]="shortcut">
        <p class="doc-flat">
          Press <kbd ui-kbd>Ctrl</kbd> + <kbd ui-kbd>K</kbd> to search.
        </p>
      </app-example>

      <app-example
        title="In Arabic"
        description="Key names stay as printed on the keyboard."
        [rtl]="true"
        [code]="arabic"
      >
        <p class="doc-flat">اضغط <kbd ui-kbd>Esc</kbd> للإغلاق.</p>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class KbdPageComponent {
  protected readonly usage = {
    angular: `import { KbdComponent } from '@lamsa-ui/angular';`,
    react: `import { Kbd } from '@lamsa-ui/react';`,
    vue: `import { Kbd } from '@lamsa-ui/vue';`,
    html: `<kbd class="ui-kbd">Esc</kbd>`,
  };

  protected readonly shortcut = {
    angular: `<p>Press <kbd ui-kbd>Ctrl</kbd> + <kbd ui-kbd>K</kbd> to search.</p>`,
    react: `<p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.</p>`,
    vue: `<p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.</p>`,
    html: `<p>Press <kbd class="ui-kbd">Ctrl</kbd> + <kbd class="ui-kbd">K</kbd> to search.</p>`,
  };

  protected readonly arabic = {
    angular: `<p>اضغط <kbd ui-kbd>Esc</kbd> للإغلاق.</p>`,
    react: `<p>اضغط <Kbd>Esc</Kbd> للإغلاق.</p>`,
    vue: `<p>اضغط <Kbd>Esc</Kbd> للإغلاق.</p>`,
    html: `<p>اضغط <kbd class="ui-kbd">Esc</kbd> للإغلاق.</p>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Code or a value the reader types, such as a coupon',
      use: 'A plain code element',
    },
    {
      need: 'A short label for a status',
      use: 'Badge',
      path: '/components/badge',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'kbd[ui-kbd]',
        type: 'selector',
        description: 'On a native kbd element. The key name is its content.',
      },
    ],
    react: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The key name.',
      },
      {
        name: '...props',
        type: 'kbd props',
        description: 'Every native kbd prop.',
      },
    ],
    vue: [
      {
        name: '#default',
        type: 'slot',
        description: 'The key name.',
      },
    ],
    html: [
      {
        name: 'ui-kbd',
        type: 'class',
        description: 'On a kbd element: one per key.',
      },
    ],
  };
}
