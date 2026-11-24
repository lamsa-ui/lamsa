import { Component, signal } from '@angular/core';
import { PaginationComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-pagination-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    PaginationComponent,
  ],
  template: `
    <app-page
      title="Pagination"
      lead="Moves through long lists a page at a time. A named navigation landmark: each page button says its number, the current page is marked, and the line of shown rows is announced when it changes."
      [usage]="usage"
    >
      <app-example
        title="Pages"
        description="The first and last page, the current one and its neighbours. Previous and next stay focusable at the ends, so focus never jumps away. On a phone only the arrows and the current page show."
        [code]="basic"
      >
        <ui-pagination
          class="doc-wide"
          [(page)]="page"
          [total]="230"
          [pageSize]="10"
        />
      </app-example>

      <app-example
        title="Rows per page"
        description="Changing the size goes back to page 1, so the reader never lands on a page that no longer exists. Two paginations on one page need different names, so this one is called Order pages."
        [code]="sizes"
      >
        <ui-pagination
          class="doc-wide"
          [(page)]="sizedPage"
          [(pageSize)]="pageSize"
          [total]="42"
          [pageSizes]="[10, 20, 50]"
          [labels]="{ nav: 'Order pages' }"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-pagination
          class="doc-wide"
          [(page)]="arabicPage"
          [total]="230"
          [pageSize]="10"
          [labels]="labelsAr"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PaginationPageComponent {
  protected readonly page = signal(5);
  protected readonly sizedPage = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly arabicPage = signal(2);
  protected readonly labelsAr = {
    nav: 'التنقل بين الصفحات',
    previous: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    page: (n: number) => `صفحة ${n}`,
    summary: (first: number, last: number, total: number) =>
      `${first}–${last} من ${total}`,
    pageSize: 'عدد الصفوف',
  };

  protected readonly usage = {
    angular: `import { PaginationComponent } from '@ghazal-ui/angular';`,
    react: `import { Pagination } from '@ghazal-ui/react';`,
    vue: `import { Pagination } from '@ghazal-ui/vue';`,
    html: `<nav class="ui-pagination" aria-label="Pagination">...</nav>`,
  };

  protected readonly basic = {
    angular: `page = signal(5);

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" />`,
    react: `const [page, setPage] = useState(5);

<Pagination page={page} onPageChange={setPage} total={230} pageSize={10} />`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
const page = ref(5);
</script>

<template>
  <Pagination v-model:page="page" :total="230" :page-size="10" />
</template>`,
    html: `<nav class="ui-pagination" aria-label="Pagination">
  <p class="ui-pagination__summary" role="status">41–50 of 230</p>
  <ul class="ui-pagination__list">
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Previous page">
      <i class="ui-icon ui-icon-chevron-left ui-pagination__arrow" aria-hidden="true"></i></button></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 1">1</button></li>
    <li><span class="ui-pagination__gap" aria-hidden="true">…</span></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 5" aria-current="page">5</button></li>
    ...
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Next page">
      <i class="ui-icon ui-icon-chevron-right ui-pagination__arrow" aria-hidden="true"></i></button></li>
  </ul>
</nav>
<!-- At the first or last page: aria-disabled="true" on the arrow, not disabled, so it keeps focus. -->`,
  };

  protected readonly sizes = {
    angular: `<ui-pagination
  [(page)]="page"
  [(pageSize)]="pageSize"
  [total]="42"
  [pageSizes]="[10, 20, 50]"
  [labels]="{ nav: 'Order pages' }"
/>`,
    react: `<Pagination
  page={page}
  onPageChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  total={42}
  pageSizes={[10, 20, 50]}
  labels={{ nav: 'Order pages' }}
/>`,
    vue: `<Pagination
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="42"
  :page-sizes="[10, 20, 50]"
  :labels="{ nav: 'Order pages' }"
/>`,
    html: `<div class="ui-pagination__size">
  <span>Rows per page</span>
  <button type="button" class="ui-button ui-button--secondary ui-button--md" aria-label="Rows per page: 10">
    10
    <i class="ui-icon ui-icon-chevron-down ui-select__chevron" aria-hidden="true"></i>
  </button>
</div>`,
  };

  protected readonly arabic = {
    angular: `labels = {
  nav: 'التنقل بين الصفحات',
  previous: 'الصفحة السابقة',
  next: 'الصفحة التالية',
  page: (n: number) => \`صفحة \${n}\`,
  summary: (first: number, last: number, total: number) => \`\${first}–\${last} من \${total}\`,
  pageSize: 'عدد الصفوف',
};

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" [labels]="labels" />`,
    react: `<Pagination page={page} onPageChange={setPage} total={230} pageSize={10} labels={labels} />`,
    vue: `<Pagination v-model:page="page" :total="230" :page-size="10" :labels="labels" />`,
    html: `<!-- dir="rtl" on the page: the arrows turn round by themselves -->
<nav class="ui-pagination" aria-label="التنقل بين الصفحات">...</nav>`,
  };

  protected readonly alternatives: Alternative[] = [
    { need: 'Steps of a task', use: 'Stepper', path: '/components/stepper' },
    {
      need: 'Where the page sits in the site',
      use: 'Breadcrumbs',
      path: '/components/breadcrumbs',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'page',
        type: 'number (model)',
        description: 'Required. The current page, from 1. Bind [(page)].',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Required. Rows across all pages.',
      },
      {
        name: 'pageSize',
        type: 'number (model)',
        default: '10',
        description: 'Rows per page. Bind [(pageSize)] with a picker.',
      },
      {
        name: 'pageSizes',
        type: 'number[]',
        default: '[]',
        description: 'Offer these sizes in a picker. Empty: no picker.',
      },
      {
        name: 'labels',
        type: 'Partial<PaginationLabels>',
        description:
          'Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize.',
      },
    ],
    react: [
      {
        name: 'page / onPageChange',
        type: 'number / (page) => void',
        description: 'Required. The current page, from 1.',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Required. Rows across all pages.',
      },
      {
        name: 'pageSize / onPageSizeChange',
        type: 'number / (size) => void',
        default: '10',
        description: 'Rows per page; a new size also calls onPageChange(1).',
      },
      {
        name: 'pageSizes',
        type: 'number[]',
        default: '[]',
        description: 'Offer these sizes in a picker. Empty: no picker.',
      },
      {
        name: 'labels',
        type: 'Partial<PaginationLabels>',
        description:
          'Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize.',
      },
    ],
    vue: [
      {
        name: 'v-model:page',
        type: 'number',
        description: 'Required. The current page, from 1.',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Required. Rows across all pages.',
      },
      {
        name: 'v-model:pageSize',
        type: 'number',
        default: '10',
        description: 'Rows per page; a new size also calls onPageChange(1).',
      },
      {
        name: 'pageSizes',
        type: 'number[]',
        default: '[]',
        description: 'Offer these sizes in a picker. Empty: no picker.',
      },
      {
        name: 'labels',
        type: 'Partial<PaginationLabels>',
        description:
          'Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize.',
      },
    ],
    html: [
      {
        name: 'nav.ui-pagination + aria-label',
        type: 'element + class',
        description: 'A named navigation landmark.',
      },
      {
        name: 'ui-pagination__summary role="status"',
        type: 'class + attribute',
        description: 'Which rows are shown, announced when it changes.',
      },
      {
        name: 'ui-pagination__page + aria-label + aria-current',
        type: 'class + attribute',
        description:
          'Name every page button, and mark the current one with aria-current="page".',
      },
      {
        name: 'ui-pagination__step + aria-disabled',
        type: 'class + attribute',
        description:
          'Previous and next; at the ends use aria-disabled="true", not disabled.',
      },
      {
        name: 'ui-pagination__gap aria-hidden',
        type: 'class + attribute',
        description: 'The "…" between page numbers.',
      },
    ],
  };
}
