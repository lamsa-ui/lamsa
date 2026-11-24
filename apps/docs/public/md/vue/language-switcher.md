# Language switcher

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Switches the interface language. Each language is named in itself, so someone who reads only that language can find it, and carries its lang, so screen readers say it in the right voice. No flags: a flag is a country, not a language. Set lang and dir on the html element when the language changes.

Docs: https://ghazal-ui.github.io/ghazal/components/language-switcher

```ts
import { LanguageSwitcher, type Language } from '@ghazal-ui/vue';
```

When to use something else:

- Any other choice from a list: [Select](https://ghazal-ui.github.io/ghazal/components/select)
- Switch between views of a page: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `languages` | `Language[]` |  | Required. { code, name }, each name in its own language. |
| `v-model:current` | `string` |  | Required. The current language's code. |
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

```vue
<LanguageSwitcher
  v-model:current="language"
  :languages="[
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ]"
/>
```

### Three or more

A menu with the current language checked. The button reads its label first: “Language: English”.

```vue
<LanguageSwitcher v-model:current="language" :languages="languages" />
```

### In Arabic

```vue
<LanguageSwitcher v-model:current="language" label="اللغة" size="sm" :languages="languages" />
```
