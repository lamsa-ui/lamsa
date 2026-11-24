# File field

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The browser's own file input, with a label, hint and error, in a zone that also takes files dropped on it. The native button and file names stay, so it works with the keyboard, screen readers and phone cameras as usual.

Docs: https://ghazal-ui.github.io/ghazal/components/file-field

```html
<input class="ui-file" type="file" id="invoice" accept=".pdf" />
```

When to use something else:

- Typed text or a link to a file: [Text field](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-file` | `class` |  | On the input type="file". |
| `ui-dropzone` | `class` |  | The dashed zone around it. |
| `ui-dropzone--over` | `class` |  | While a file is dragged over the zone. |
| `ui-dropzone__text` | `class` |  | The line under the button. |

Keyboard and screen readers:

- Enter or Space: Open the file chooser.
- The browser’s own file input: the button and the chosen file names are read as usual.
- Dropping files is a shortcut; the button always works.

## Examples

### One file

accept limits what the picker offers. It cannot stop a drop, so check the type and size again on the server.

```html
<div class="ui-field">
  <label class="ui-field__label" for="invoice">Invoice</label>
  <div class="ui-dropzone">
    <input class="ui-file" type="file" id="invoice" accept=".pdf" aria-describedby="invoice-hint" />
  </div>
  <p class="ui-field__hint" id="invoice-hint">PDF, up to 5 MB.</p>
</div>
<!-- Taking drops needs script: on drop, set input.files = event.dataTransfer.files -->
```

### Several files, with an error

```html
<div class="ui-field ui-field--invalid">
  <label class="ui-field__label" for="photos">Photos of the damage</label>
  <div class="ui-dropzone">
    <input class="ui-file" type="file" id="photos" accept="image/*" multiple
           aria-invalid="true" aria-describedby="photos-error" />
    <p class="ui-dropzone__text">Or drop photos here</p>
  </div>
  <p class="ui-field__error" id="photos-error" role="alert">Add at least one photo</p>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page; the browser writes its own button in the reader's language -->
```
