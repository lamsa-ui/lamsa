# Language switcher

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Switches the interface language. Each language is named in itself, so someone who reads only that language can find it, and carries its lang, so screen readers say it in the right voice. No flags: a flag is a country, not a language. Set lang and dir on the html element when the language changes.

Docs: https://lamsa-ui.github.io/lamsa/components/language-switcher

```html
<!-- Two languages: a link to the other one, named in itself -->
<a class="ui-button ui-button--secondary ui-button--md" href="/ar/" lang="ar" hreflang="ar">عربي</a>
<!-- Three or more: the menu button pattern, see Menu, with role="menuitemradio" and aria-checked -->
```

When to use something else:

- Any other choice from a list: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Switch between views of a page: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `lang` | `attribute` |  | On each language name, with its own code. |
| `ui-menu__item[aria-checked="true"]` | `selector` |  | The current language in a menu: bold, with a check mark. |

## Examples

### Two languages

One button that names the other language.

```html
<a class="ui-button ui-button--secondary ui-button--md" href="/ar/" lang="ar" hreflang="ar">عربي</a>
```

### Three or more

A menu with the current language checked. The button reads its label first: “Language: English”.

```html
<!-- See "Use it" -->
```

### In Arabic

```html
<!-- dir="rtl" on the page; the markup is the same -->
```
