import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-vue-integrations-page',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Vue integrations"
      lead="Every Lamsa component in Vue 3.5: the same names, options and markup as in Angular and React, bound with v-model and slots. Overlays, menus, dates and trees run on Reka UI; everything else is plain Vue on the shared Lamsa CSS."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Install</h2>
        <app-code-block
          caption="Terminal"
          text="pnpm add @lamsa-ui/vue @lamsa-ui/css vue"
        />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Load the styles once</h2>
        <app-code-block
          caption="src/main.css"
          text="@import '@lamsa-ui/css/ui.css';"
        />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Use a control with v-model</h2>
        <app-code-block [text]="example" />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">How the Vue API reads</h2>
        <ul>
          <li>
            The value is <code>v-model</code>; a second value has its own, such
            as <code>v-model:open</code>, <code>v-model:page</code> or
            <code>v-model:selected</code>.
          </li>
          <li>
            What React takes as a function prop is an event:
            <code>&#64;dismiss</code>, <code>&#64;remove</code>,
            <code>&#64;run</code>.
          </li>
          <li>
            Content goes in slots: <code>#actions</code>, <code>#trigger</code>,
            a tab's panel in the slot named after its id.
          </li>
          <li>
            For toasts, put <code>&lt;ToastProvider&gt;</code> around the app
            once and call <code>useToast()</code>; for alert and confirm, render
            the <code>dialog</code> that <code>useAlertDialog()</code> returns.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class VueIntegrationsPageComponent {
  protected readonly example = `<script setup lang="ts">
import { Button, TextField } from '@lamsa-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>`;
}
