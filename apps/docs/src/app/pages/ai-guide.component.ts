import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SITE_URL } from '../shared/site';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

/** The AI guide: what llms.txt is, how to hand it to an assistant, and a live look at the file. */
@Component({
  selector: 'app-ai-guide',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Build with AI"
      lead="Give your AI assistant our guide before it writes UI. It then uses the real components, props and tokens instead of guessing, and follows the accessibility and right-to-left rules."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">The two files</h2>
        <p>
          Both are plain text, generated from these docs, so they match the
          version you are reading.
        </p>
        <div
          class="ui-table-wrap"
          tabindex="0"
          role="region"
          aria-labelledby="ai-files"
        >
          <table class="ui-table">
            <caption class="doc-visually-hidden" id="ai-files">
              The AI guide files
            </caption>
            <thead>
              <tr>
                <th scope="col">File</th>
                <th scope="col">Use it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><a href="llms.txt">llms.txt</a></th>
                <td>
                  The tool can follow links. A short index: the rules and a link
                  to every component.
                </td>
              </tr>
              <tr>
                <th scope="row"><a href="llms-full.txt">llms-full.txt</a></th>
                <td>
                  You want one file with everything: setup per framework,
                  tokens, and every component's usage and options. Best for
                  Cursor, Claude Code, Copilot and chat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <app-code-block [text]="fullUrl" caption="Address of the full guide" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Use it in four steps</h2>
        <ol class="doc-list">
          <li>
            Copy the address above, or download
            <a href="llms-full.txt" download>llms-full.txt</a> into your
            project.
          </li>
          <li>
            Give it to your tool. Tools that read a URL (Claude Code, Cursor
            <code>&#64;Docs</code>, Copilot Chat <code>#fetch</code>) take the
            address. In others, attach the file or paste its text into the
            conversation.
          </li>
          <li>
            Make it permanent: add one line to your project's rules file
            (<code>CLAUDE.md</code>, <code>AGENTS.md</code>,
            <code>.cursor/rules</code>,
            <code>.github/copilot-instructions.md</code>) so every session
            starts with it.
          </li>
          <li>
            Ask for the UI you want and name the framework. Then run the checks
            in
            <a href="getting-started">Getting started</a>.
          </li>
        </ol>
        <app-code-block [text]="rule" caption="Line for your rules file" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Prompts that work</h2>
        <p>
          Each one names the framework, the screen and the languages, which is
          what the assistant cannot guess.
        </p>
        <app-code-block [text]="promptForm" caption="A form" />
        <app-code-block [text]="promptReview" caption="Review existing code" />
        <app-code-block [text]="promptRebrand" caption="Re-brand" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What the guide tells the assistant</h2>
        <ul class="doc-list">
          <li>
            Use the kit's components. Never hand-build one it already has.
          </li>
          <li>
            Style only through <code>--ui-*</code> tokens and Tailwind classes,
            never raw colours, pixel spacing or overrides of
            <code>.ui-*</code> classes.
          </li>
          <li>
            Use logical properties (<code>ms-2</code>, <code>pe-4</code>) so
            layouts flip in Arabic, and set <code>lang</code> and
            <code>dir</code>.
          </li>
          <li>
            Never invent a prop or component: if it is not in the guide, it does
            not exist.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">The index, live</h2>
        <p>This is the file as served, so you see what the assistant sees.</p>
        @if (index(); as text) {
          <div class="doc-code">
            <div class="doc-code__bar">
              <span class="ui-label">llms.txt</span>
              <button
                type="button"
                class="ui-button ui-button--ghost ui-button--sm"
                (click)="copyIndex(text)"
              >
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre tabindex="0"><code>{{ text }}</code></pre>
            <span class="doc-visually-hidden" aria-live="polite">{{
              copied() ? 'File copied' : ''
            }}</span>
          </div>
        } @else if (failed()) {
          <p class="doc-note">
            The file could not load. Open <a href="llms.txt">llms.txt</a>
            directly.
          </p>
        } @else {
          <p class="doc-note" role="status">Loading the file…</p>
        }
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Keep it current</h2>
        <p>
          Update the <code>&#64;lamsa-ui/*</code> packages, then fetch the guide
          again: it describes the version this site shows. Maintainers
          regenerate it with <code>pnpm llms</code> after changing a component
          page; <code>pnpm llms --check</code> fails when it is stale.
        </p>
      </section>
    </app-page>
  `,
})
export class AiGuideComponent {
  private readonly doc = inject(DOCUMENT);

  protected readonly index = signal('');
  protected readonly failed = signal(false);
  protected readonly copied = signal(false);

  protected readonly fullUrl = `${SITE_URL}llms-full.txt`;

  protected readonly rule = `This project uses Lamsa. Before writing any UI, read ${this.fullUrl} and follow its rules.`;

  protected readonly promptForm = `Using Lamsa (Angular), build a "Book a site visit" form: full name, city (select), a switch for SMS updates and a primary submit button that shows a loading state. Support English and Arabic with correct RTL. Use only components and props from ${this.fullUrl}.`;

  protected readonly promptReview = `Review this file against ${this.fullUrl}. List every hand-built control the kit already has, every raw colour or pixel value, every left/right instead of start/end, and every prop that does not exist. Then fix them.`;

  protected readonly promptRebrand = `Re-brand this app to a deep green using only the --ui-* tokens, as described in ${this.fullUrl}. Keep 7:1 contrast for text on the primary colour in light and dark, and show me the :root override.`;

  constructor() {
    fetch(new URL('llms.txt', this.doc.baseURI))
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.statusText))))
      .then((text) => this.index.set(text))
      .catch(() => this.failed.set(true));
  }

  protected async copyIndex(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // clipboard blocked: the text is still selectable
    }
  }
}
