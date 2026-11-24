import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent, IconComponent } from '@lamsa-ui/angular';
import { A11Y, KEY_WORDS } from './a11y';
import { CodeBlockComponent } from './code-block.component';
import { DocsSettings, type FrameworkCode } from './docs-settings';
import { NAV } from './nav';

const PAGES = NAV.flatMap((g) => g.links);

/**
 * Page chrome: a patterned hero with the chapter, the heading and lead, then for components
 * the import line. The chapter comes from the route.
 * Around the content: an "On this page" list of its h2s (wide screens) and links to the
 * previous and next page in side-bar order.
 */
@Component({
  selector: 'app-page',
  imports: [ButtonComponent, CodeBlockComponent, IconComponent, RouterLink],
  host: { class: 'doc-page' },
  template: `
    <header class="doc-section doc-hero" [attr.data-chapter]="chapter.title">
      <span class="doc-hero__art" aria-hidden="true"></span>
      <p class="ui-label doc-hero__eyebrow">
        <span class="doc-hero__chapter">Chapter {{ chapter.number }}</span>
        {{ chapter.title }}
      </p>
      <h1 class="ui-heading doc-h1">{{ title() }}</h1>
      <p class="doc-lead">{{ lead() }}</p>
      @if (usage(); as code) {
        <app-code-block caption="Use it" [code]="code" />
        <p class="doc-hero__copy">
          <button
            ui-button
            variant="secondary"
            size="sm"
            type="button"
            (click)="copyPage()"
          >
            <ui-icon name="copy" ui-button-start />
            Copy page as Markdown
          </button>
          <span role="status">{{ copied() }}</span>
        </p>
      }
    </header>
    @if (toc().length > 1) {
      <nav class="doc-toc" aria-label="On this page">
        <p class="ui-label doc-toc__title">On this page</p>
        <ol>
          @for (h of toc(); track h.id) {
            <li>
              <a [routerLink]="[]" [fragment]="h.id">{{ h.text }}</a>
            </li>
          }
        </ol>
      </nav>
    }
    <ng-content />
    @if (a11y; as a) {
      <section class="doc-section">
        <h2 class="ui-heading doc-h2" id="keyboard">
          Keyboard and screen readers
        </h2>
        @if (a.script && settings.framework() === 'html') {
          <p>
            In plain HTML these keys come from your own script, following the
            matching WAI-ARIA pattern; the markup and classes are on this page.
          </p>
        }
        @if (a.keys; as keys) {
          <div
            class="doc-table-wrap"
            tabindex="0"
            role="region"
            aria-label="Keys"
          >
            <table class="doc-table">
              <thead>
                <tr>
                  <th scope="col">Keys</th>
                  <th scope="col">What they do</th>
                </tr>
              </thead>
              <tbody>
                @for (row of keys; track $index) {
                  <tr>
                    <td>
                      @for (key of row[0]; track key; let last = $last) {
                        @if (keyWords.includes(key)) {
                          {{ key }}
                        } @else {
                          @for (
                            part of key.split(' + ');
                            track $index;
                            let lastPart = $last
                          ) {
                            <kbd class="ui-kbd">{{ part }}</kbd>{{
                              lastPart ? '' : ' + '
                            }}
                          }
                        }
                        {{ last ? '' : ' or ' }}
                      }
                    </td>
                    <td>{{ row[1] }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        <ul class="doc-list">
          @for (note of a.notes; track note) {
            <li>{{ note }}</li>
          }
        </ul>
      </section>
    }
    <nav class="doc-pager" aria-label="Previous and next page">
      @if (prev; as p) {
        <a class="doc-pager__link" [routerLink]="p.path" rel="prev">
          <span class="ui-label">Previous</span>{{ p.label }}
        </a>
      }
      @if (next; as n) {
        <a
          class="doc-pager__link doc-pager__link--next"
          [routerLink]="n.path"
          rel="next"
        >
          <span class="ui-label">Next</span>{{ n.label }}
        </a>
      }
    </nav>
  `,
})
export class PageComponent {
  readonly title = input.required<string>();
  readonly lead = input.required<string>();
  readonly usage = input<FrameworkCode>();

  private readonly path = inject(Router).url.split(/[?#]/)[0];
  protected readonly chapter = this.findChapter();
  private readonly at = PAGES.findIndex((p) => p.path === this.path);
  protected readonly prev = this.at > 0 ? PAGES[this.at - 1] : null;
  protected readonly next = this.at >= 0 ? (PAGES[this.at + 1] ?? null) : null;
  protected readonly toc = signal<{ id: string; text: string }[]>([]);
  protected readonly copied = signal('');
  protected readonly settings = inject(DocsSettings);
  protected readonly keyWords = KEY_WORDS;
  protected readonly a11y = this.path.startsWith('/components/')
    ? (A11Y[this.path.split('/').pop() ?? ''] ?? null)
    : null;

  /**
   * Copies this page in the reader's framework, from the Markdown that `pnpm llms` writes,
   * for pasting into an AI assistant. The fetch goes inside the ClipboardItem, so Safari
   * still counts it as part of the click.
   */
  protected async copyPage(): Promise<void> {
    const url = new URL(
      `md/${this.settings.framework()}/${this.path.split('/').pop()}.md`,
      document.baseURI,
    );
    const text = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`${response.status}`);
      return new Blob([await response.text()], { type: 'text/plain' });
    });
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': text }),
      ]);
      this.copied.set('Copied');
    } catch {
      this.copied.set('Could not copy. Open the AI guide instead.');
    }
    setTimeout(() => this.copied.set(''), 3000);
  }

  constructor() {
    const title = inject(Title);
    queueMicrotask(() => title.setTitle(`${this.title()} · Lamsa`));
    const host: HTMLElement = inject(ElementRef).nativeElement;
    afterNextRender(() => {
      const headings = [...host.querySelectorAll('h2')];
      this.toc.set(
        headings.map((h, i) => {
          const text = h.textContent?.trim() ?? '';
          h.id ||=
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '') || `section-${i + 1}`;
          return { id: h.id, text };
        }),
      );
    });
  }

  private findChapter(): { title: string; number: string } {
    const index = NAV.findIndex((g) =>
      g.links.some((l) => l.path === this.path),
    );
    const at = Math.max(index, 0);
    return {
      title: NAV[at].title,
      number: String(at + 1).padStart(2, '0'),
    };
  }
}
