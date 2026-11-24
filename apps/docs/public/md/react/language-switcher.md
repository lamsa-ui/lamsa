# Language switcher

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Switches the interface language. Each language is named in itself, so someone who reads only that language can find it, and carries its lang, so screen readers say it in the right voice. No flags: a flag is a country, not a language. Set lang and dir on the html element when the language changes.

Docs: https://lamsa-ui.github.io/lamsa/components/language-switcher

```tsx
import { LanguageSwitcher, type Language } from '@lamsa-ui/react';
```

When to use something else:

- Any other choice from a list: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Switch between views of a page: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `languages` | `Language[]` |  | Required. { code, name }, each name in its own language. |
| `current` | `string` |  | Required. The current language's code. |
| `onChange` | `(code: string) => void` |  | Required. Called with the chosen language's code. |
| `label` | `string` | `'Language' from labels` | Three or more: read before the current name on the button. Translate it. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The button's size. |

Keyboard and screen readers:

- Enter or Space or Down: Open the list of languages.
- Up or Down: Move through the languages.
- Escape: Close it, and put focus back on the button.
- Each language is named in itself and carries its lang, so it is read in the right voice.

## Examples

### Two languages

One button that names the other language.

```tsx
<LanguageSwitcher
  languages={[
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ]}
  current={language}
  onChange={setLanguage}
/>
```

### Three or more

A menu with the current language checked. The button reads its label first: “Language: English”.

```tsx
<LanguageSwitcher languages={languages} current={language} onChange={setLanguage} />
```

### In Arabic

```tsx
<LanguageSwitcher label="اللغة" size="sm" languages={languages} current={language} onChange={setLanguage} />
```
