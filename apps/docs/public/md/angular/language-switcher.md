# Language switcher

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Switches the interface language. Each language is named in itself, so someone who reads only that language can find it, and carries its lang, so screen readers say it in the right voice. No flags: a flag is a country, not a language. Set lang and dir on the html element when the language changes.

Docs: https://lamsa-ui.github.io/lamsa/components/language-switcher

```ts
import { LanguageSwitcherComponent, type Language } from '@lamsa-ui/angular';
// Three or more languages use the Angular CDK menu. Add @angular/cdk/overlay-prebuilt.css.
```

When to use something else:

- Any other choice from a list: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Switch between views of a page: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `languages` | `Language[]` |  | Required. { code, name }, each name in its own language. |
| `[(current)]` | `string` |  | Required. The current language's code. |
| `label` | `string` | `'Language'` | Three or more: read before the current name on the button, and the menu’s name. Translate it. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The button's size. |

## Examples

### Two languages

One button that names the other language.

```html
<ui-language-switcher [languages]="languages" [(current)]="language" />

languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
];
language = signal('en');
```

### Three or more

A menu with the current language checked. The button reads its label first: “Language: English”.

```html
<ui-language-switcher [languages]="languages" [(current)]="language" />

languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
  { code: 'fr', name: 'Français' },
];
```

### In Arabic

```html
<ui-language-switcher label="اللغة" size="sm" [languages]="languages" [(current)]="language" />
```
