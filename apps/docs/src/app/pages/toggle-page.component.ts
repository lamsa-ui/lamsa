import { Component, signal } from '@angular/core';
import { IconComponent, ToggleComponent } from '@ghazal-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-toggle-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ToggleComponent,
    IconComponent,
  ],
  template: `
    <app-page
      title="Toggle"
      lead="A button that stays pressed until it is pressed again. The label stays the same; screen readers hear 'pressed' or 'not pressed', and the look changes in fill and border, not colour alone."
      [usage]="usage"
    >
      <app-example
        title="With a label"
        description="Pressed is shown by the fill and a thicker border."
        [code]="labelled"
      >
        <button ui-toggle [(pressed)]="pinned">
          <ui-icon name="bookmark" ui-button-start />
          Pin order
        </button>
        <p class="doc-flat">{{ pinned() ? 'Pinned' : 'Not pinned' }}</p>
      </app-example>

      <app-example
        title="Icon only"
        description="With no words on it, the aria-label names it."
        [code]="icon"
      >
        <button ui-toggle iconOnly aria-label="Favourite" [(pressed)]="liked">
          <ui-icon name="star" />
        </button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button ui-toggle>تثبيت الطلب</button>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TogglePageComponent {
  protected readonly pinned = signal(false);
  protected readonly liked = signal(true);

  protected readonly usage = {
    angular: `import { ToggleComponent } from '@ghazal-ui/angular';`,
    react: `import { Toggle } from '@ghazal-ui/react';`,
    vue: `import { Toggle } from '@ghazal-ui/vue';`,
    html: `<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">Pin order</button>`,
  };

  protected readonly labelled = {
    angular: `<button ui-toggle [(pressed)]="pinned">
  <ui-icon name="bookmark" ui-button-start />
  Pin order
</button>`,
    react: `const [pinned, setPinned] = useState(false);

<Toggle pressed={pinned} onPressedChange={setPinned}>
  <Icon name="bookmark" />
  Pin order
</Toggle>`,
    vue: `<Toggle v-model:pressed="pinned">
  <Icon name="bookmark" />
  Pin order
</Toggle>`,
    html: `<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">
  Pin order
</button>
<script>
  const toggle = document.querySelector('.ui-toggle');
  toggle.addEventListener('click', () =>
    toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true')),
  );
</script>`,
  };

  protected readonly icon = {
    angular: `<button ui-toggle iconOnly aria-label="Favourite" [(pressed)]="liked">
  <ui-icon name="star" />
</button>`,
    react: `<Toggle iconOnly aria-label="Favourite" defaultPressed>
  <Icon name="star" />
</Toggle>`,
    vue: `<Toggle v-model:pressed="liked" icon-only aria-label="Favourite">
  <Icon name="star" />
</Toggle>`,
    html: `<button class="ui-button ui-button--secondary ui-button--md ui-button--icon ui-toggle" type="button" aria-pressed="true" aria-label="Favourite">
  <i class="ui-icon ui-icon-star" aria-hidden="true"></i>
</button>`,
  };

  protected readonly arabic = {
    angular: `<button ui-toggle>تثبيت الطلب</button>`,
    react: `<Toggle>تثبيت الطلب</Toggle>`,
    vue: `<Toggle>تثبيت الطلب</Toggle>`,
    html: `<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">تثبيت الطلب</button>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A setting that takes effect at once, such as notifications',
      use: 'Switch',
      path: '/components/switch',
    },
    {
      need: 'One of several views, such as grid or list',
      use: 'Segmented control',
      path: '/components/segmented-control',
    },
    {
      need: 'An action that happens once, such as Save',
      use: 'Button',
      path: '/components/button',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: '[(pressed)]',
        type: 'boolean',
        default: 'false',
        description: 'Pressed or not, two-way.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and text size, as on Button.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square, for an icon alone. Give it an aria-label.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Cannot be pressed.',
      },
    ],
    react: [
      {
        name: 'pressed',
        type: 'boolean',
        description: 'Pressed now. Pass it with onPressedChange to control it.',
      },
      {
        name: 'defaultPressed',
        type: 'boolean',
        default: 'false',
        description: 'Pressed at first, when the toggle keeps its own state.',
      },
      {
        name: 'onPressedChange',
        type: '(pressed: boolean) => void',
        description: 'Called with the new state on every press.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and text size, as on Button.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square, for an icon alone. Give it an aria-label.',
      },
      {
        name: '...props',
        type: 'button props',
        description: 'Every native button prop, such as disabled.',
      },
    ],
    vue: [
      {
        name: 'v-model:pressed',
        type: 'boolean',
        description:
          'Pressed or not. Without it the toggle keeps its own state.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and text size, as on Button.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square, for an icon alone. Give it an aria-label.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Cannot be pressed.',
      },
    ],
    html: [
      {
        name: 'ui-toggle',
        type: 'class',
        description:
          'On a .ui-button--secondary button. Your script flips aria-pressed on click.',
      },
      {
        name: 'aria-pressed',
        type: '"true" | "false"',
        description: 'Required. The state, read by screen readers and the CSS.',
      },
    ],
  };
}
