import { Component, signal } from '@angular/core';
import { type Language, LanguageSwitcherComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-language-switcher-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    LanguageSwitcherComponent,
  ],
  template: `
    <app-page
      title="Language switcher"
      lead="Switches the interface language. Each language is named in itself, so someone who reads only that language can find it, and carries its lang, so screen readers say it in the right voice. No flags: a flag is a country, not a language. Set lang and dir on the html element when the language changes."
      [usage]="usage"
    >
      <app-example
        title="Two languages"
        description="One button that names the other language."
        [code]="basic"
      >
        <ui-language-switcher [languages]="two" [(current)]="language" />
      </app-example>

      <app-example
        title="Three or more"
        description="A menu with the current language checked. The button reads its label first: “Language: English”."
        [code]="more"
      >
        <ui-language-switcher [languages]="three" [(current)]="another" />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-language-switcher
          label="اللغة"
          size="sm"
          [languages]="three"
          [(current)]="arabicLanguage"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class LanguageSwitcherPageComponent {
  protected readonly two: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ];
  protected readonly three: Language[] = [
    ...this.two,
    { code: 'fr', name: 'Français' },
  ];
  protected readonly language = signal('en');
  protected readonly another = signal('en');
  protected readonly arabicLanguage = signal('ar');

  protected readonly usage = {
    angular: `import { LanguageSwitcherComponent, type Language } from '@ghazal-ui/angular';
// Three or more languages use the Angular CDK menu. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { LanguageSwitcher, type Language } from '@ghazal-ui/react';`,
    vue: `import { LanguageSwitcher, type Language } from '@ghazal-ui/vue';`,
    html: `<!-- Two languages: a link to the other one, named in itself -->
<a class="ui-button ui-button--secondary ui-button--md" href="/ar/" lang="ar" hreflang="ar">عربي</a>
<!-- Three or more: the menu button pattern, see Menu, with role="menuitemradio" and aria-checked -->`,
  };

  protected readonly basic = {
    angular: `<ui-language-switcher [languages]="languages" [(current)]="language" />

languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
];
language = signal('en');`,
    react: `<LanguageSwitcher
  languages={[
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ]}
  current={language}
  onChange={setLanguage}
/>`,
    vue: `<LanguageSwitcher
  v-model:current="language"
  :languages="[
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ]"
/>`,
    html: `<a class="ui-button ui-button--secondary ui-button--md" href="/ar/" lang="ar" hreflang="ar">عربي</a>`,
  };

  protected readonly more = {
    angular: `<ui-language-switcher [languages]="languages" [(current)]="language" />

languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
  { code: 'fr', name: 'Français' },
];`,
    react: `<LanguageSwitcher languages={languages} current={language} onChange={setLanguage} />`,
    vue: `<LanguageSwitcher v-model:current="language" :languages="languages" />`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly arabic = {
    angular: `<ui-language-switcher label="اللغة" size="sm" [languages]="languages" [(current)]="language" />`,
    react: `<LanguageSwitcher label="اللغة" size="sm" languages={languages} current={language} onChange={setLanguage} />`,
    vue: `<LanguageSwitcher v-model:current="language" label="اللغة" size="sm" :languages="languages" />`,
    html: `<!-- dir="rtl" on the page; the markup is the same -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Any other choice from a list',
      use: 'Select',
      path: '/components/select',
    },
    {
      need: 'Switch between views of a page',
      use: 'Segmented control',
      path: '/components/segmented-control',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'languages',
        type: 'Language[]',
        description: 'Required. { code, name }, each name in its own language.',
      },
      {
        name: '[(current)]',
        type: 'string',
        description: "Required. The current language's code.",
      },
      {
        name: 'label',
        type: 'string',
        default: "'Language' from labels",
        description:
          'Three or more: read before the current name on the button, and the menu’s name. Translate it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "The button's size.",
      },
    ],
    react: [
      {
        name: 'languages',
        type: 'Language[]',
        description: 'Required. { code, name }, each name in its own language.',
      },
      {
        name: 'current',
        type: 'string',
        description: "Required. The current language's code.",
      },
      {
        name: 'onChange',
        type: '(code: string) => void',
        description: "Required. Called with the chosen language's code.",
      },
      {
        name: 'label',
        type: 'string',
        default: "'Language' from labels",
        description:
          'Three or more: read before the current name on the button. Translate it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "The button's size.",
      },
    ],
    vue: [
      {
        name: 'languages',
        type: 'Language[]',
        description: 'Required. { code, name }, each name in its own language.',
      },
      {
        name: 'v-model:current',
        type: 'string',
        description: "Required. The current language's code.",
      },
      {
        name: 'label',
        type: 'string',
        default: "'Language' from labels",
        description:
          'Three or more: read before the current name on the button. Translate it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "The button's size.",
      },
    ],
    html: [
      {
        name: 'lang',
        type: 'attribute',
        description: 'On each language name, with its own code.',
      },
      {
        name: 'ui-menu__item[aria-checked="true"]',
        type: 'selector',
        description: 'The current language in a menu: bold, with a check mark.',
      },
    ],
  };
}
