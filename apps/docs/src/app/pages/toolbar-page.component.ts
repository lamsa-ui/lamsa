import { Component } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  ToggleComponent,
  ToolbarComponent,
  ToolbarSeparatorComponent,
} from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-toolbar-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    IconComponent,
    ToggleComponent,
    ToolbarComponent,
    ToolbarSeparatorComponent,
  ],
  template: `
    <app-page
      title="Toolbar"
      lead="A row of controls that counts as one stop for the Tab key. Inside it the arrow keys move from control to control, flipped in Arabic; Home and End jump to the ends. Tab again leaves it."
      [usage]="usage"
    >
      <app-example
        title="Editor actions"
        description="Tab in, then use the arrow keys. Tab out and back: focus returns to the last control you used."
        [code]="editor"
      >
        <ui-toolbar label="Note">
          <button
            ui-button
            variant="ghost"
            iconOnly
            type="button"
            aria-label="Undo"
          >
            <ui-icon name="undo-2" />
          </button>
          <button
            ui-button
            variant="ghost"
            iconOnly
            type="button"
            aria-label="Redo"
          >
            <ui-icon name="redo-2" />
          </button>
          <ui-toolbar-separator />
          <button ui-toggle size="sm" iconOnly aria-label="Pin">
            <ui-icon name="bookmark" />
          </button>
          <button ui-button variant="ghost" type="button">
            <ui-icon name="copy" ui-button-start />
            Copy
          </button>
          <button ui-button variant="ghost" type="button">
            <ui-icon name="trash-2" ui-button-start />
            Delete
          </button>
        </ui-toolbar>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-toolbar label="الطلب">
          <button ui-button variant="ghost" type="button">طباعة</button>
          <button ui-button variant="ghost" type="button">استرداد</button>
          <button ui-button variant="ghost" type="button">إلغاء</button>
        </ui-toolbar>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ToolbarPageComponent {
  protected readonly usage = {
    angular: `import { ToolbarComponent, ToolbarSeparatorComponent } from '@lamsa-ui/angular';`,
    react: `import { Toolbar, ToolbarSeparator } from '@lamsa-ui/react';`,
    vue: `import { Toolbar, ToolbarSeparator } from '@lamsa-ui/vue';`,
    html: `<div class="ui-toolbar" role="toolbar" aria-label="Note">…</div>`,
  };

  protected readonly editor = {
    angular: `<ui-toolbar label="Note">
  <button ui-button variant="ghost" iconOnly type="button" aria-label="Undo">
    <ui-icon name="undo-2" />
  </button>
  <button ui-button variant="ghost" iconOnly type="button" aria-label="Redo">
    <ui-icon name="redo-2" />
  </button>
  <ui-toolbar-separator />
  <button ui-toggle size="sm" iconOnly aria-label="Pin">
    <ui-icon name="bookmark" />
  </button>
  <button ui-button variant="ghost" type="button">Copy</button>
  <button ui-button variant="ghost" type="button">Delete</button>
</ui-toolbar>`,
    react: `<Toolbar label="Note">
  <Button variant="ghost" iconOnly aria-label="Undo"><Icon name="undo-2" /></Button>
  <Button variant="ghost" iconOnly aria-label="Redo"><Icon name="redo-2" /></Button>
  <ToolbarSeparator />
  <Toggle size="sm" iconOnly aria-label="Pin"><Icon name="bookmark" /></Toggle>
  <Button variant="ghost">Copy</Button>
  <Button variant="ghost">Delete</Button>
</Toolbar>`,
    vue: `<Toolbar label="Note">
  <Button variant="ghost" icon-only aria-label="Undo"><Icon name="undo-2" /></Button>
  <Button variant="ghost" icon-only aria-label="Redo"><Icon name="redo-2" /></Button>
  <ToolbarSeparator />
  <Toggle size="sm" icon-only aria-label="Pin"><Icon name="bookmark" /></Toggle>
  <Button variant="ghost">Copy</Button>
  <Button variant="ghost">Delete</Button>
</Toolbar>`,
    html: `<div class="ui-toolbar" role="toolbar" aria-label="Note">
  <button class="ui-button ui-button--ghost ui-button--md ui-button--icon" type="button" aria-label="Undo" tabindex="0">
    <i class="ui-icon ui-icon-undo-2" aria-hidden="true"></i>
  </button>
  <button class="ui-button ui-button--ghost ui-button--md ui-button--icon" type="button" aria-label="Redo" tabindex="-1">
    <i class="ui-icon ui-icon-redo-2" aria-hidden="true"></i>
  </button>
  <div class="ui-toolbar__separator" role="separator"></div>
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="-1">Copy</button>
</div>
<!-- Your script: arrow keys move focus and the tabindex="0" to the next control. -->`,
  };

  protected readonly arabic = {
    angular: `<ui-toolbar label="الطلب">
  <button ui-button variant="ghost" type="button">طباعة</button>
  <button ui-button variant="ghost" type="button">استرداد</button>
  <button ui-button variant="ghost" type="button">إلغاء</button>
</ui-toolbar>`,
    react: `<Toolbar label="الطلب">
  <Button variant="ghost">طباعة</Button>
  <Button variant="ghost">استرداد</Button>
  <Button variant="ghost">إلغاء</Button>
</Toolbar>`,
    vue: `<Toolbar label="الطلب">
  <Button variant="ghost">طباعة</Button>
  <Button variant="ghost">استرداد</Button>
  <Button variant="ghost">إلغاء</Button>
</Toolbar>`,
    html: `<div class="ui-toolbar" role="toolbar" aria-label="الطلب">
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="0">طباعة</button>
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="-1">استرداد</button>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Two or three buttons that sit together',
      use: 'Button group',
      path: '/components/button-group',
    },
    {
      need: 'Links to other pages',
      use: 'Navigation',
      path: '/components/nav',
    },
    {
      need: 'Actions that do not fit, behind one button',
      use: 'Menu',
      path: '/components/menu',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. What the controls act on, for screen readers.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which arrow keys move: left and right, or up and down.',
      },
      {
        name: '<ui-toolbar-separator>',
        type: 'component',
        description: 'A line between groups of controls.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. What the controls act on, for screen readers.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which arrow keys move: left and right, or up and down.',
      },
      {
        name: '<ToolbarSeparator>',
        type: 'component',
        description: 'A line between groups of controls.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. What the controls act on, for screen readers.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Which arrow keys move: left and right, or up and down.',
      },
      {
        name: '<ToolbarSeparator>',
        type: 'component',
        description: 'A line between groups of controls.',
      },
    ],
    html: [
      {
        name: 'ui-toolbar',
        type: 'class',
        description:
          'With role="toolbar" and aria-label. The arrow keys are your script.',
      },
      {
        name: 'ui-toolbar__separator',
        type: 'class',
        description: 'A line between groups. Add role="separator".',
      },
      {
        name: 'aria-orientation="vertical"',
        type: 'attribute',
        description: 'Stacks the controls; up and down arrows move.',
      },
    ],
  };
}
