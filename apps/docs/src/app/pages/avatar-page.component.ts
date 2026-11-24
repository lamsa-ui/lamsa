import { Component } from '@angular/core';
import { AvatarComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-avatar-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    AvatarComponent,
  ],
  template: `
    <app-page
      title="Avatar"
      lead="A person's photo, or their initials when there is no photo or it fails to load. Screen readers hear the person's name, never the file name."
      [usage]="usage"
    >
      <app-example
        title="Initials and sizes"
        description="Initials are the first letter of the first and last word, so they work for Arabic names too. A broken photo falls back to initials."
        [code]="sizes"
      >
        <div class="flex items-center gap-3">
          <ui-avatar name="Hatem Mohamed" size="sm" />
          <ui-avatar name="Mohamed Ibrahim" />
          <ui-avatar name="Ibrahim Hatem" size="lg" src="/missing-photo.jpg" />
        </div>
      </app-example>

      <app-example
        title="Next to a name"
        description="When the name is written beside it, mark the avatar decorative so a screen reader says the name once."
        [code]="named"
      >
        <div class="flex items-center gap-3">
          <ui-avatar name="Hatem Mohamed" decorative />
          <span>Hatem Mohamed</span>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <div class="flex items-center gap-3">
          <ui-avatar name="حاتم محمد" />
          <ui-avatar name="محمد" />
        </div>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AvatarPageComponent {
  protected readonly usage = {
    angular: `import { AvatarComponent } from '@lamsa-ui/angular';`,
    react: `import { Avatar } from '@lamsa-ui/react';`,
    vue: `import { Avatar } from '@lamsa-ui/vue';`,
    html: `<span class="ui-avatar" role="img" aria-label="Hatem Mohamed">HM</span>`,
  };

  protected readonly sizes = {
    angular: `<ui-avatar name="Hatem Mohamed" size="sm" />
<ui-avatar name="Mohamed Ibrahim" />
<ui-avatar name="Ibrahim Hatem" size="lg" src="/ibrahim.jpg" />`,
    react: `<Avatar name="Hatem Mohamed" size="sm" />
<Avatar name="Mohamed Ibrahim" />
<Avatar name="Ibrahim Hatem" size="lg" src="/ibrahim.jpg" />`,
    vue: `<Avatar name="Hatem Mohamed" size="sm" />
<Avatar name="Mohamed Ibrahim" />
<Avatar name="Ibrahim Hatem" size="lg" src="/ibrahim.jpg" />`,
    html: `<span class="ui-avatar ui-avatar--sm" role="img" aria-label="Hatem Mohamed">HM</span>
<span class="ui-avatar" role="img" aria-label="Mohamed Ibrahim">MI</span>
<span class="ui-avatar ui-avatar--lg" role="img" aria-label="Ibrahim Hatem">
  <img src="/ibrahim.jpg" alt="" />
</span>`,
  };

  protected readonly named = {
    angular: `<div class="flex items-center gap-3">
  <ui-avatar name="Hatem Mohamed" decorative />
  <span>Hatem Mohamed</span>
</div>`,
    react: `<div className="flex items-center gap-3">
  <Avatar name="Hatem Mohamed" decorative />
  <span>Hatem Mohamed</span>
</div>`,
    vue: `<div class="flex items-center gap-3">
  <Avatar name="Hatem Mohamed" decorative />
  <span>Hatem Mohamed</span>
</div>`,
    html: `<div class="flex items-center gap-3">
  <span class="ui-avatar" aria-hidden="true">HM</span>
  <span>Hatem Mohamed</span>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-avatar name="حاتم محمد" />`,
    react: `<Avatar name="حاتم محمد" />`,
    vue: `<Avatar name="حاتم محمد" />`,
    html: `<span class="ui-avatar" role="img" aria-label="حاتم محمد">م&zwnj;ع</span>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Show several people in a small space',
      use: 'Avatar group',
      path: '/components/avatar-group',
    },
    {
      need: 'Show a status next to a person, such as online',
      use: 'Status dot',
      path: '/components/status-dot',
    },
    { need: 'A logo or a product picture', use: 'A plain img with alt text' },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'name',
        type: 'string',
        description:
          'Required. Read by screen readers and turned into the initials.',
      },
      {
        name: 'src',
        type: 'string',
        description: 'The photo. Initials show while it is missing or broken.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '32, 40 or 56 pixels.',
      },
      {
        name: 'decorative',
        type: 'boolean',
        default: 'false',
        description:
          'Hides it from screen readers, for when the name is on screen next to it.',
      },
    ],
    react: [
      {
        name: 'name',
        type: 'string',
        description:
          'Required. Read by screen readers and turned into the initials.',
      },
      {
        name: 'src',
        type: 'string',
        description: 'The photo. Initials show while it is missing or broken.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '32, 40 or 56 pixels.',
      },
      {
        name: 'decorative',
        type: 'boolean',
        default: 'false',
        description:
          'Hides it from screen readers, for when the name is on screen next to it.',
      },
    ],
    vue: [
      {
        name: 'name',
        type: 'string',
        description:
          'Required. Read by screen readers and turned into the initials.',
      },
      {
        name: 'src',
        type: 'string',
        description: 'The photo. Initials show while it is missing or broken.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '32, 40 or 56 pixels.',
      },
      {
        name: 'decorative',
        type: 'boolean',
        default: 'false',
        description:
          'Hides it from screen readers, for when the name is on screen next to it.',
      },
    ],
    html: [
      {
        name: 'ui-avatar',
        type: 'class',
        description:
          'Required. Add role="img" and aria-label with the name, or aria-hidden="true" when the name is beside it.',
      },
      {
        name: 'ui-avatar--sm | --lg',
        type: 'class',
        description: 'The size. Without one it is 40 pixels.',
      },
      {
        name: '--ui-avatar-size',
        type: 'custom property',
        default: '2.5rem',
        description: 'Any other size; the initials scale with it.',
      },
      {
        name: 'img alt=""',
        type: 'child',
        description:
          'The photo. Its alt stays empty: the avatar itself carries the name. Swap to initials on its error event.',
      },
    ],
  };
}
