import { Component, computed, inject, input, signal } from '@angular/core';
import { DocsSettings, FRAMEWORKS, type FrameworkCode } from './docs-settings';

/** Code for the reader's framework, with a copy button. Pass `text` for code that is the same everywhere. */
@Component({
  selector: 'app-code-block',
  host: { class: 'doc-code' },
  template: `
    <div class="doc-code__bar">
      <span class="ui-label">{{ caption() || frameworkLabel() }}</span>
      @if (source()) {
        <button
          type="button"
          class="ui-button ui-button--ghost ui-button--sm"
          (click)="copyCode()"
        >
          {{ copied() ? 'Copied' : 'Copy' }}
        </button>
      }
    </div>
    @if (source(); as text) {
      <pre tabindex="0"><code>{{ text }}</code></pre>
    } @else {
      <p class="doc-note">Not available in {{ frameworkLabel() }} yet.</p>
    }
    <span class="doc-visually-hidden" aria-live="polite">{{
      copied() ? 'Code copied' : ''
    }}</span>
  `,
})
export class CodeBlockComponent {
  readonly code = input<FrameworkCode>({});
  readonly text = input<string>();
  readonly caption = input<string>();

  private readonly settings = inject(DocsSettings);
  protected readonly copied = signal(false);
  protected readonly source = computed(
    () => this.text() ?? this.code()[this.settings.framework()],
  );
  protected readonly frameworkLabel = computed(
    () =>
      FRAMEWORKS.find((f) => f.id === this.settings.framework())?.label ?? '',
  );

  protected async copyCode(): Promise<void> {
    const text = this.source();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard blocked: the code stays selectable in the block.
    }
  }
}
