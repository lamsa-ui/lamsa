# Meter

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A level inside a known range: storage used, a plan's limit, a score. It is not work in progress, that is Progress. The value is written next to the label, so the tone colour only repeats what the words say.

Docs: https://lamsa-ui.github.io/lamsa/components/meter

```html
<div class="ui-meter">…<div class="ui-meter__bar" role="meter">…</div></div>
```

When to use something else:

- Work that is still going, such as an upload: [Progress](https://lamsa-ui.github.io/lamsa/components/progress)
- One number and how it changed: [Stat](https://lamsa-ui.github.io/lamsa/components/stat)
- A value the reader sets: [Slider](https://lamsa-ui.github.io/lamsa/components/slider)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-meter` | `class` |  | The wrapper. Tones: ui-meter--success, --warning, --danger. |
| `ui-meter__bar` | `class` |  | The track: role="meter", aria-labelledby, aria-valuenow/min/max and aria-valuetext. |
| `--ui-meter-value` | `CSS length` |  | On ui-meter__fill: how full, as a percentage. |

## Examples

### Levels

You choose the tone from the value: the meter does not guess what is good or bad.

```html
<div class="ui-meter ui-meter--warning">
  <div class="ui-meter__head">
    <span class="ui-meter__label" id="storage">Storage</span>
    <span class="ui-meter__value" aria-hidden="true">7.2 of 10 GB</span>
  </div>
  <div class="ui-meter__bar" role="meter" aria-labelledby="storage"
       aria-valuenow="7.2" aria-valuemin="0" aria-valuemax="10" aria-valuetext="7.2 of 10 GB">
    <span class="ui-meter__fill" style="--ui-meter-value: 72%"></span>
  </div>
</div>
```

### In Arabic

```html
<div class="ui-meter ui-meter--warning">…</div>
```
