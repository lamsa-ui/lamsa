import { Component } from '@angular/core';
import { AvatarGroupComponent } from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-avatar-group-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    AvatarGroupComponent,
  ],
  template: `
    <app-page
      title="Avatar group"
      lead="Several people in a small space: the first few avatars overlap and a '+3' stands for the rest. The group has a name, every avatar is still named, and '+3' is read as '3 more'."
      [usage]="usage"
    >
      <app-example title="A team" [code]="team">
        <ui-avatar-group label="Kitchen team" [people]="people" [max]="3" />
      </app-example>

      <app-example
        title="In Arabic"
        description="Translate the '+n' name with moreLabel."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-avatar-group
          label="فريق المطبخ"
          [people]="arabicPeople"
          [max]="2"
          [moreLabel]="arabicMore"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AvatarGroupPageComponent {
  protected readonly people = [
    { name: 'Hatem Mohamed' },
    { name: 'Mohamed Ibrahim' },
    { name: 'Ibrahim Hatem' },
    { name: 'Hatem Ibrahim' },
    { name: 'Mohamed Hatem' },
  ];
  protected readonly arabicPeople = [
    { name: 'حاتم محمد' },
    { name: 'محمد إبراهيم' },
    { name: 'إبراهيم حاتم' },
  ];
  protected readonly arabicMore = (count: number) => `${count} آخرون`;

  protected readonly usage = {
    angular: `import { AvatarGroupComponent } from '@lamsa-ui/angular';`,
    react: `import { AvatarGroup } from '@lamsa-ui/react';`,
    vue: `import { AvatarGroup } from '@lamsa-ui/vue';`,
    html: `<div class="ui-avatar-group" role="group" aria-label="Kitchen team">…</div>`,
  };

  protected readonly team = {
    angular: `<ui-avatar-group label="Kitchen team" [people]="people" [max]="3" />

people = [{ name: 'Hatem Mohamed', src: '/hatem.jpg' }, { name: 'Mohamed Ibrahim' }, …];`,
    react: `<AvatarGroup label="Kitchen team" people={people} max={3} />`,
    vue: `<AvatarGroup label="Kitchen team" :people="people" :max="3" />`,
    html: `<div class="ui-avatar-group" role="group" aria-label="Kitchen team">
  <span class="ui-avatar" role="img" aria-label="Hatem Mohamed">HM</span>
  <span class="ui-avatar" role="img" aria-label="Mohamed Ibrahim">MI</span>
  <span class="ui-avatar" role="img" aria-label="Ibrahim Hatem">IH</span>
  <span class="ui-avatar ui-avatar-group__more" role="img" aria-label="2 more">+2</span>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-avatar-group label="فريق المطبخ" [people]="people" [max]="2" [moreLabel]="more" />

more = (count: number) => \`\${count} آخرون\`;`,
    react: `<AvatarGroup
  label="فريق المطبخ"
  people={people}
  max={2}
  moreLabel={(count) => \`\${count} آخرون\`}
/>`,
    vue: `<AvatarGroup
  label="فريق المطبخ"
  :people="people"
  :max="2"
  :more-label="(count) => \`\${count} آخرون\`"
/>`,
    html: `<div class="ui-avatar-group" role="group" aria-label="فريق المطبخ">
  <span class="ui-avatar" role="img" aria-label="حاتم محمد">م\u200cع</span>
  <span class="ui-avatar ui-avatar-group__more" role="img" aria-label="1 آخرون">+1</span>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One person',
      use: 'Avatar',
      path: '/components/avatar',
    },
    {
      need: 'Every name visible, such as a list of attendees',
      use: 'A list or Data table',
      path: '/components/data-table',
    },
  ];

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Who the group is, for screen readers.',
    },
    {
      name: 'people',
      type: 'AvatarPerson[]',
      description: 'Required. { name, src? } for each person, in order.',
    },
    {
      name: 'max',
      type: 'number',
      default: '4',
      description: 'How many avatars to show before "+n".',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of every avatar.',
    },
    {
      name: 'moreLabel',
      type: '(count: number) => string',
      default: '(n) => `${n} more` from labels',
      description: 'The spoken name of "+n". Translate it.',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: this.shared,
    vue: this.shared,
    html: [
      {
        name: 'ui-avatar-group',
        type: 'class',
        description:
          'Overlaps the .ui-avatar children. Add role="group" and aria-label.',
      },
      {
        name: 'ui-avatar-group__more',
        type: 'class',
        description:
          'On the "+n" avatar. Give it an aria-label such as "2 more".',
      },
    ],
  };
}
