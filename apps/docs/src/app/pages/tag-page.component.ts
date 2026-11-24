import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { TagComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const FILTERS = ['Paid', 'This week', 'Cairo', 'Delivery'];

@Component({
  selector: 'app-tag-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TagComponent,
  ],
  template: `
    <app-page
      title="Tag"
      lead="A label the user added or can take away, such as an active filter or a topic. For a status like Paid or Late, use a badge."
      [usage]="usage"
    >
      <app-example title="Labels" [code]="plain">
        <ul class="flex flex-wrap gap-2" aria-label="Topics">
          <li><ui-tag>Angular</ui-tag></li>
          <li><ui-tag>React</ui-tag></li>
          <li><ui-tag>Accessibility</ui-tag></li>
        </ul>
      </app-example>

      <app-example
        title="Removable"
        description="The × is read as 'Remove Paid'. After a tag goes, focus moves to the next tag, or to Reset when none is left, so the keyboard never drops to the top of the page."
        [code]="removable"
      >
        <div class="grid gap-3" #list>
          <ul class="flex flex-wrap gap-2" aria-label="Active filters">
            @for (filter of filters(); track filter; let i = $index) {
              <li>
                <ui-tag removable (remove)="drop(i)">{{ filter }}</ui-tag>
              </li>
            }
          </ul>
          <button
            type="button"
            class="ui-button ui-button--ghost ui-button--sm w-fit"
            (click)="reset()"
          >
            Reset filters
          </button>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-tag removable removeLabel="إزالة">القاهرة</ui-tag>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TagPageComponent {
  protected readonly filters = signal(FILTERS);
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly injector = inject(Injector);

  protected drop(index: number): void {
    this.filters.update((all) => all.filter((_, i) => i !== index));
    // Once the tag is gone: the one now at this index, else the one before, else Reset.
    afterNextRender(
      () => {
        const root = this.list().nativeElement;
        const buttons = root.querySelectorAll<HTMLElement>('.ui-tag__remove');
        const next =
          buttons[Math.min(index, buttons.length - 1)] ??
          root.querySelector<HTMLElement>(':scope > button');
        next?.focus();
      },
      { injector: this.injector },
    );
  }

  protected reset(): void {
    this.filters.set(FILTERS);
  }

  protected readonly usage = {
    angular: `import { TagComponent } from '@ghazal-ui/angular';`,
    react: `import { Tag } from '@ghazal-ui/react';`,
    vue: `import { Tag } from '@ghazal-ui/vue';`,
    html: `<span class="ui-tag">Angular</span>`,
  };

  protected readonly plain = {
    angular: `<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><ui-tag>Angular</ui-tag></li>
  <li><ui-tag>React</ui-tag></li>
</ul>`,
    react: `<ul className="flex flex-wrap gap-2" aria-label="Topics">
  <li><Tag>Angular</Tag></li>
  <li><Tag>React</Tag></li>
</ul>`,
    vue: `<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><Tag>Angular</Tag></li>
  <li><Tag>React</Tag></li>
</ul>`,
    html: `<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><span class="ui-tag">Angular</span></li>
  <li><span class="ui-tag">React</span></li>
</ul>`,
  };

  protected readonly removable = {
    angular: `<ul class="flex flex-wrap gap-2" aria-label="Active filters">
  @for (filter of filters(); track filter; let i = $index) {
    <li>
      <ui-tag removable (remove)="drop(i)">{{ filter }}</ui-tag>
    </li>
  }
</ul>
<!-- In drop(): remove it, then focus the next tag's × button -->`,
    react: `<ul className="flex flex-wrap gap-2" aria-label="Active filters">
  {filters.map((filter, i) => (
    <li key={filter}>
      <Tag onRemove={() => drop(i)}>{filter}</Tag>
    </li>
  ))}
</ul>
{/* In drop(): remove it, then focus the next tag's × button */}`,
    vue: `<ul class="flex flex-wrap gap-2" aria-label="Active filters">
  <li v-for="(filter, i) in filters" :key="filter">
    <Tag @remove="drop(i)">{{ filter }}</Tag>
  </li>
</ul>
<!-- In drop(): remove it, then focus the next tag's × button -->`,
    html: `<span class="ui-tag">
  <span id="tag-paid">Paid</span>
  <button type="button" class="ui-tag__remove" id="tag-paid-x"
    aria-label="Remove" aria-labelledby="tag-paid-x tag-paid">
    <i class="ui-icon ui-icon-x" aria-hidden="true"></i>
  </button>
</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-tag removable removeLabel="إزالة" (remove)="drop(0)">القاهرة</ui-tag>`,
    react: `<Tag onRemove={() => drop(0)} removeLabel="إزالة">القاهرة</Tag>`,
    vue: `<Tag @remove="drop(0)" removeLabel="إزالة">القاهرة</Tag>`,
    html: `<span class="ui-tag">
  <span id="tag-cairo">القاهرة</span>
  <button type="button" class="ui-tag__remove" id="tag-cairo-x"
    aria-label="إزالة" aria-labelledby="tag-cairo-x tag-cairo">...</button>
</span>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A status the user cannot remove',
      use: 'Badge',
      path: '/components/badge',
    },
    {
      need: 'Let the user type new labels',
      use: 'Chip input',
      path: '/components/chip-input',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'removable',
        type: 'boolean',
        default: 'false',
        description: 'Shows the × button.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        default: "'Remove' from labels",
        description:
          "The button's first word; the tag's text follows it. Translate it.",
      },
      {
        name: '(remove)',
        type: 'void',
        description: 'The × was pressed. Remove the tag and move focus on.',
      },
    ],
    react: [
      {
        name: 'onRemove',
        type: '() => void',
        description:
          'Shows the × button and is called when it is pressed. Remove the tag and move focus on.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        default: "'Remove' from labels",
        description:
          "The button's first word; the tag's text follows it. Translate it.",
      },
      {
        name: '...props',
        type: 'span props',
        description: 'Every native span prop.',
      },
    ],
    vue: [
      {
        name: '@remove',
        type: 'event',
        description:
          'Shows the × button and is called when it is pressed. Remove the tag and move focus on.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        default: "'Remove' from labels",
        description:
          "The button's first word; the tag's text follows it. Translate it.",
      },
    ],
    html: [
      { name: 'ui-tag', type: 'class', description: 'Required.' },
      {
        name: 'ui-tag__remove',
        type: 'class',
        description:
          'The × button, 24 pixels square. Label it with aria-labelledby: its own aria-label, then the text.',
      },
    ],
  };
}
