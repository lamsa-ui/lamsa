import { Component, signal } from '@angular/core';
import {
  ContextMenuTriggerDirective,
  MenuComponent,
  MenuItemComponent,
} from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-context-menu-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ContextMenuTriggerDirective,
    MenuComponent,
    MenuItemComponent,
  ],
  template: `
    <app-page
      title="Context menu"
      lead="Actions that open where the reader right-clicks, long-presses, or presses Shift+F10 on the focused item. It is a shortcut: the same actions must also be somewhere visible, because touch and keyboard users rarely look for one."
      [usage]="usage"
    >
      <app-example
        title="On a file"
        description="Right-click the file, or Tab to it and press Shift+F10."
        [code]="file"
      >
        <div
          class="rounded-ui border border-dashed border-border p-4 focus-visible:focus-ring"
          tabindex="0"
          [uiContextMenu]="fileActions"
        >
          invoice-1042.pdf
        </div>
        <p class="doc-flat" role="status">{{ last() }}</p>
        <ng-template #fileActions>
          <ui-menu>
            <button ui-menu-item (triggered)="last.set('Renamed')">
              Rename
            </button>
            <button ui-menu-item (triggered)="last.set('Copied')">
              Make a copy
            </button>
            <button ui-menu-item danger (triggered)="last.set('Deleted')">
              Delete
            </button>
          </ui-menu>
        </ng-template>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ContextMenuPageComponent {
  protected readonly last = signal('');

  protected readonly usage = {
    angular: `import {
  ContextMenuTriggerDirective,
  MenuComponent,
  MenuItemComponent,
} from '@lamsa-ui/angular';`,
    react: `import { ContextMenu } from '@lamsa-ui/react';`,
    vue: `import { ContextMenu } from '@lamsa-ui/vue';`,
    html: `<!-- Plain HTML: listen for contextmenu and open a .ui-menu list in a popover. -->`,
  };

  protected readonly file = {
    angular: `<div tabindex="0" [uiContextMenu]="fileActions">invoice-1042.pdf</div>
<ng-template #fileActions>
  <ui-menu>
    <button ui-menu-item (triggered)="rename()">Rename</button>
    <button ui-menu-item (triggered)="copy()">Make a copy</button>
    <button ui-menu-item danger (triggered)="remove()">Delete</button>
  </ui-menu>
</ng-template>`,
    react: `<ContextMenu
  items={[
    { id: 'rename', label: 'Rename' },
    { id: 'copy', label: 'Make a copy' },
    { id: 'delete', label: 'Delete', danger: true },
  ]}
  onAction={run}
>
  <div tabIndex={0}>invoice-1042.pdf</div>
</ContextMenu>`,
    vue: `<ContextMenu
  :items="[
    { id: 'rename', label: 'Rename' },
    { id: 'copy', label: 'Make a copy' },
    { id: 'delete', label: 'Delete', danger: true },
  ]"
  @action="run"
>
  <div tabindex="0">invoice-1042.pdf</div>
</ContextMenu>`,
    html: `<div tabindex="0" id="file">invoice-1042.pdf</div>
<div class="ui-menu" role="menu" id="file-menu" popover>
  <button class="ui-menu__item" role="menuitem" type="button">Rename</button>
  <button class="ui-menu__item ui-menu__item--danger" role="menuitem" type="button">Delete</button>
</div>
<script>
  // Open at the pointer, move focus into the menu, arrow keys move, Escape closes.
  document.getElementById('file').addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const menu = document.getElementById('file-menu');
    menu.style.position = 'fixed';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    menu.showPopover();
    menu.querySelector('button').focus();
  });
</script>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'The visible way to the same actions',
      use: 'Menu',
      path: '/components/menu',
    },
    {
      need: 'Actions that should always be on screen',
      use: 'Toolbar',
      path: '/components/toolbar',
    },
    {
      need: 'Search every command in the app',
      use: 'Command palette',
      path: '/components/command-palette',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'uiContextMenu',
        type: 'TemplateRef',
        description:
          'On the area that opens it: an ng-template holding a <ui-menu>. Make the area focusable.',
      },
      {
        name: 'uiContextMenuDisabled',
        type: 'boolean',
        default: 'false',
        description: 'Right-click shows the browser menu instead.',
      },
      {
        name: '<button ui-menu-item>',
        type: 'component',
        description:
          'One action, as in Menu: (triggered) fires for click, Enter and Space; danger for red text.',
      },
    ],
    react: [
      {
        name: 'items',
        type: 'MenuAction[]',
        description:
          'Required. { id, label, danger?, disabled? } for each action.',
      },
      {
        name: 'onAction',
        type: '(id: string) => void',
        description:
          "Called with the chosen action's id; the menu then closes.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Right-click shows the browser menu instead.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The area that opens the menu. Make it focusable.',
      },
    ],
    vue: [
      {
        name: 'items',
        type: 'MenuAction[]',
        description:
          'Required. { id, label, danger?, disabled? } for each action.',
      },
      {
        name: '@action',
        type: '(id: string) => void',
        description: "The chosen action's id; the menu then closes.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Right-click shows the browser menu instead.',
      },
      {
        name: '#default',
        type: 'slot',
        description: 'The area that opens the menu. Make it focusable.',
      },
    ],
    html: [
      {
        name: 'ui-menu',
        type: 'class',
        description:
          'The list, with role="menu". Opening, focus and keys are your script.',
      },
      {
        name: 'ui-menu__item',
        type: 'class',
        description: 'One action, with role="menuitem". --danger for red text.',
      },
    ],
  };
}
