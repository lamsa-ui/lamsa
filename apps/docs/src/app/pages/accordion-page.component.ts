import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionContentDirective,
  AccordionItemComponent,
} from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

/** Shows when it was created, to tell reloaded content from kept. */
@Component({
  selector: 'app-created-at',
  template: `<p>Created at {{ time }}.</p>`,
})
class CreatedAtComponent {
  protected readonly time = new Date().toLocaleTimeString();
}

@Component({
  selector: 'app-accordion-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    AccordionComponent,
    AccordionContentDirective,
    AccordionItemComponent,
    CreatedAtComponent,
  ],
  template: `
    <app-page
      title="Accordion"
      lead="A stack of sections that open and close, such as questions and answers. Built on the native details element, so it opens with Enter and Space, works without script, and the browser's find-in-page opens the section that holds the match. Sections grow and shrink smoothly both ways, Up and Down move between the headings, and the chevron mirrors in Arabic."
      [usage]="usage"
    >
      <app-example
        title="Questions"
        description="single keeps one section open at a time."
        [code]="basic"
      >
        <ui-accordion single class="doc-wide">
          <details ui-accordion-item heading="Can I change my order?" open>
            <p>Yes, until it ships. Open the order and choose Edit.</p>
          </details>
          <details ui-accordion-item heading="How do refunds work?">
            <p>
              Send the item back within 14 days. The money is back in 5 working
              days.
            </p>
          </details>
          <details ui-accordion-item heading="Do you deliver outside Cairo?">
            <p>Yes, to every governorate, in 2 to 4 days.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-example
        title="Chevron at the start"
        description="As in a tree: it points to where the text reads on, and turns down to open. A description adds a quieter line."
        [code]="start"
      >
        <ui-accordion icon="start" class="doc-wide">
          <details
            ui-accordion-item
            heading="Shipping address"
            description="12 Tahrir Street, Cairo"
          >
            <p>Change it until the order ships.</p>
          </details>
          <details
            ui-accordion-item
            heading="Payment"
            description="Visa ending 4242"
          >
            <p>Charged when the order ships.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-example
        title="Lazy, kept and disabled"
        description="Lazy content is created when its section opens, such as a list that loads from an API, and goes once it has closed, so each open loads it again. keep holds on to it instead. A disabled section stays focusable and announced."
        [code]="lazy"
      >
        <ui-accordion class="doc-wide">
          <details ui-accordion-item heading="Invoices (loads on each open)">
            <ng-template uiAccordionContent>
              <app-created-at />
            </ng-template>
          </details>
          <details ui-accordion-item heading="History (kept)" keep>
            <ng-template uiAccordionContent>
              <app-created-at />
            </ng-template>
          </details>
          <details ui-accordion-item heading="Archived orders" disabled>
            <p>Not available on this plan.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-accordion single class="doc-wide">
          <details ui-accordion-item heading="أقدر أغيّر طلبي؟" open>
            <p>أيوه، لحد ما يتشحن.</p>
          </details>
          <details ui-accordion-item heading="الاسترجاع بيتم إزاي؟">
            <p>رجّع المنتج خلال ١٤ يوم.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-example
        title="In Arabic, chevron at the start"
        description="It points left, where Arabic reads on, and turns down to open."
        [rtl]="true"
        [code]="arabicStart"
      >
        <ui-accordion icon="start" class="doc-wide">
          <details
            ui-accordion-item
            heading="عنوان الشحن"
            description="١٢ شارع التحرير، القاهرة"
          >
            <p>تقدر تغيّره لحد ما الطلب يتشحن.</p>
          </details>
          <details
            ui-accordion-item
            heading="الدفع"
            description="فيزا آخرها ٤٢٤٢"
          >
            <p>بيتخصم لما الطلب يتشحن.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AccordionPageComponent {
  protected readonly usage = {
    angular: `import {
  AccordionComponent,
  AccordionContentDirective,
  AccordionItemComponent,
} from '@ghazal-ui/angular';
// Each item is a native <details ui-accordion-item>.`,
    react: `import { Accordion, AccordionItem } from '@ghazal-ui/react';`,
    vue: `import { Accordion, AccordionItem } from '@ghazal-ui/vue';`,
    html: `<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq">
    <summary><span class="ui-accordion__heading">Can I change my order?</span></summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-accordion single>
  <details ui-accordion-item heading="Can I change my order?" open>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </details>
  <details ui-accordion-item heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </details>
</ui-accordion>`,
    react: `<Accordion single>
  <AccordionItem heading="Can I change my order?" defaultOpen>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </AccordionItem>
  <AccordionItem heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </AccordionItem>
</Accordion>`,
    vue: `<Accordion single>
  <AccordionItem heading="Can I change my order?" defaultOpen>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </AccordionItem>
  <AccordionItem heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </AccordionItem>
</Accordion>`,
    html: `<!-- The same name on each details keeps one open at a time -->
<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq" open>
    <summary><span class="ui-accordion__heading">Can I change my order?</span></summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
  <details class="ui-accordion__item" name="faq">
    <summary><span class="ui-accordion__heading">How do refunds work?</span></summary>
    <div class="ui-accordion__content"><p>Send the item back within 14 days.</p></div>
  </details>
</div>`,
  };

  protected readonly start = {
    angular: `<ui-accordion icon="start">
  <details ui-accordion-item heading="Shipping address" description="12 Tahrir Street, Cairo">
    <p>Change it until the order ships.</p>
  </details>
</ui-accordion>`,
    react: `<Accordion icon="start">
  <AccordionItem heading="Shipping address" description="12 Tahrir Street, Cairo">
    <p>Change it until the order ships.</p>
  </AccordionItem>
</Accordion>`,
    vue: `<Accordion icon="start">
  <AccordionItem heading="Shipping address" description="12 Tahrir Street, Cairo">
    <p>Change it until the order ships.</p>
  </AccordionItem>
</Accordion>`,
    html: `<div class="ui-accordion ui-accordion--icon-start">
  <details class="ui-accordion__item">
    <summary>
      <span class="ui-accordion__heading">Shipping address
        <span class="ui-accordion__description">12 Tahrir Street, Cairo</span>
      </span>
    </summary>
    <div class="ui-accordion__content"><p>Change it until the order ships.</p></div>
  </details>
</div>`,
  };

  protected readonly lazy = {
    angular: `<ui-accordion>
  <details ui-accordion-item heading="Invoices">
    <ng-template uiAccordionContent><app-invoices /></ng-template>
  </details>
  <details ui-accordion-item heading="History" keep>
    <ng-template uiAccordionContent><app-history /></ng-template>
  </details>
  <details ui-accordion-item heading="Archived orders" disabled>…</details>
</ui-accordion>`,
    react: `<Accordion>
  <AccordionItem heading="Invoices" lazy>
    <Invoices />
  </AccordionItem>
  <AccordionItem heading="History" lazy keep>
    <History />
  </AccordionItem>
  <AccordionItem heading="Archived orders" disabled>…</AccordionItem>
</Accordion>`,
    vue: `<Accordion>
  <AccordionItem heading="Invoices" lazy>
    <Invoices />
  </AccordionItem>
  <AccordionItem heading="History" lazy keep>
    <History />
  </AccordionItem>
  <AccordionItem heading="Archived orders" disabled>…</AccordionItem>
</Accordion>`,
    html: `<!-- No lazy content without script: fill the section on its toggle event.
     A disabled summary needs a click handler that calls preventDefault. -->
<summary aria-disabled="true">…</summary>`,
  };

  protected readonly arabic = {
    angular: `<ui-accordion single>
  <details ui-accordion-item heading="أقدر أغيّر طلبي؟" open>…</details>
  <details ui-accordion-item heading="الاسترجاع بيتم إزاي؟">…</details>
</ui-accordion>`,
    react: `<Accordion single>
  <AccordionItem heading="أقدر أغيّر طلبي؟" defaultOpen>…</AccordionItem>
  <AccordionItem heading="الاسترجاع بيتم إزاي؟">…</AccordionItem>
</Accordion>`,
    vue: `<Accordion single>
  <AccordionItem heading="أقدر أغيّر طلبي؟" defaultOpen>…</AccordionItem>
  <AccordionItem heading="الاسترجاع بيتم إزاي؟">…</AccordionItem>
</Accordion>`,
    html: `<!-- dir="rtl" on the page: the chevron moves to the left -->
<div class="ui-accordion">…</div>`,
  };

  protected readonly arabicStart = {
    angular: `<ui-accordion icon="start">
  <details ui-accordion-item heading="عنوان الشحن" description="١٢ شارع التحرير، القاهرة">…</details>
  <details ui-accordion-item heading="الدفع" description="فيزا آخرها ٤٢٤٢">…</details>
</ui-accordion>`,
    react: `<Accordion icon="start">
  <AccordionItem heading="عنوان الشحن" description="١٢ شارع التحرير، القاهرة">…</AccordionItem>
  <AccordionItem heading="الدفع" description="فيزا آخرها ٤٢٤٢">…</AccordionItem>
</Accordion>`,
    vue: `<Accordion icon="start">
  <AccordionItem heading="عنوان الشحن" description="١٢ شارع التحرير، القاهرة">…</AccordionItem>
  <AccordionItem heading="الدفع" description="فيزا آخرها ٤٢٤٢">…</AccordionItem>
</Accordion>`,
    html: `<!-- At the start, right to left, it points left until it opens -->
<div class="ui-accordion ui-accordion--icon-start">…</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Switch between views of the same thing, one at a time',
      use: 'Tabs',
      path: '/components/tabs',
    },
    {
      need: 'Hide one optional detail behind a button',
      use: 'Popover',
      path: '/components/popover',
    },
    {
      need: 'Show steps the reader must go through in order',
      use: 'Stepper',
      path: '/components/stepper',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'single',
        type: 'boolean',
        default: 'false',
        description: 'On ui-accordion: one section open at a time.',
      },
      {
        name: 'icon',
        type: "'end' | 'start' | 'none'",
        default: "'end'",
        description:
          'On ui-accordion, or one item: where the chevron sits. At the start it points to where the text reads on.',
      },
      {
        name: 'heading',
        type: 'string',
        description:
          'On each item: the text that opens it. For richer content, an element with uiAccordionHeading.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'On each item: a quieter line under the heading.',
      },
      {
        name: 'open, [(open)]',
        type: 'boolean',
        default: 'false',
        description: 'On each item: open or not. Closing runs its motion.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description:
          'On each item: focusable and announced, but it does not open.',
      },
      {
        name: 'ng-template uiAccordionContent',
        type: 'directive',
        description: 'Inside an item: content created when it opens.',
      },
      {
        name: 'keep',
        type: 'boolean',
        default: 'false',
        description:
          'On each item: keeps lazy content once shown. Off, it goes once closed and loads again on the next open.',
      },
    ],
    react: [
      {
        name: 'single',
        type: 'boolean',
        default: 'false',
        description: 'On Accordion: one section open at a time.',
      },
      {
        name: 'icon',
        type: "'end' | 'start' | 'none'",
        default: "'end'",
        description:
          'On Accordion, or one AccordionItem: where the chevron sits.',
      },
      {
        name: 'heading',
        type: 'ReactNode',
        description: 'Required, on AccordionItem: what opens it.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'On AccordionItem: a quieter line under the heading.',
      },
      {
        name: 'open, defaultOpen',
        type: 'boolean',
        description:
          'On AccordionItem: controlled, or open at first. Closing runs its motion.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description:
          'On AccordionItem: focusable and announced, but it does not open.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'false',
        description: 'On AccordionItem: mounts the children when it opens.',
      },
      {
        name: 'keep',
        type: 'boolean',
        default: 'false',
        description:
          'On AccordionItem: keeps lazy children once mounted. Off, they unmount once closed.',
      },
      {
        name: '...props',
        type: 'details props',
        description: 'On AccordionItem: onToggle and the rest.',
      },
    ],
    vue: [
      {
        name: 'single',
        type: 'boolean',
        default: 'false',
        description: 'On Accordion: one section open at a time.',
      },
      {
        name: 'icon',
        type: "'end' | 'start' | 'none'",
        default: "'end'",
        description:
          'On Accordion, or one AccordionItem: where the chevron sits.',
      },
      {
        name: '#heading',
        type: 'slot',
        description: 'Required, on AccordionItem: what opens it.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'On AccordionItem: a quieter line under the heading.',
      },
      {
        name: 'open, defaultOpen',
        type: 'boolean',
        description:
          'On AccordionItem: controlled, or open at first. Closing runs its motion.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description:
          'On AccordionItem: focusable and announced, but it does not open.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'false',
        description: 'On AccordionItem: mounts the children when it opens.',
      },
      {
        name: 'keep',
        type: 'boolean',
        default: 'false',
        description:
          'On AccordionItem: keeps lazy children once mounted. Off, they unmount once closed.',
      },
    ],
    html: [
      { name: 'ui-accordion', type: 'class', description: 'The wrapper.' },
      {
        name: 'ui-accordion--icon-start',
        type: 'class',
        description: 'On the wrapper: the chevron before each heading.',
      },
      {
        name: 'ui-accordion__item',
        type: 'class',
        description:
          'On each details; one name for one at a time. Add --icon-start or --no-icon for one item.',
      },
      {
        name: 'ui-accordion__heading, __description',
        type: 'class',
        description:
          'Inside the summary: the heading text, and a quieter line.',
      },
      {
        name: 'ui-accordion__content',
        type: 'class',
        description:
          'Around the content. It grows and shrinks; without script, Safari closes it at once.',
      },
    ],
  };
}
