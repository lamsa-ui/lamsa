import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NAV } from '../shared/nav';

/** Where the view starts, in degrees: a little above the floor, turned a little. */
const RX = 64;
const RZ = -18;
/** Tilt range: near 30° you look down on the pane, near 84° you are level with the floor. */
const RX_MIN = 30;
const RX_MAX = 84;
/** Ripples on the floor, each one wider and later than the last. */
const RINGS = [0, 1, 2, 3, 4, 5];
/** A tap moves less than this, in px; more is a drag. */
const TAP = 6;
/** After a drag the scene rests this long before it turns on its own again, in ms. */
const REST = 4000;
/** The scene is drawn 40rem wide and scaled to the stage. */
const MODEL_REM = 40;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pathOf = (label: string) =>
  NAV.flatMap((g) => g.links).find((l) => l.label === label)?.path ??
  '/getting-started';

/** Each part of the screen, as it looks in English, in Arabic, and as a screen reader says it. */
const PARTS = {
  title: {
    page: 'Typography',
    en: 'Invoices',
    ar: 'الفواتير',
    said: 'heading, “Invoices”',
  },
  add: {
    page: 'Button',
    en: 'New invoice',
    ar: 'فاتورة جديدة',
    said: 'button, “New invoice”',
  },
  search: {
    page: 'Search field',
    en: 'INV-10',
    ar: 'INV-10',
    said: 'search box, INV-10',
  },
  paid: {
    page: 'Switch',
    en: 'Paid only',
    ar: 'مدفوعة فقط',
    said: 'switch, off, “Paid only”',
  },
  table: {
    page: 'Data table',
    en: 'Invoices table',
    ar: 'جدول الفواتير',
    said: 'table, 3 rows',
  },
  status: {
    page: 'Badge',
    en: 'Paid',
    ar: 'مدفوعة',
    said: '“Paid”, “Due”, “Late” as text, not colour',
  },
} as const;
type PartKey = keyof typeof PARTS;

const INVOICES = [
  {
    id: 'INV-1042',
    total: '1,200.00',
    en: 'Paid',
    ar: 'مدفوعة',
    tone: 'success',
  },
  { id: 'INV-1041', total: '340.00', en: 'Due', ar: 'مستحقة', tone: 'warning' },
  { id: 'INV-1040', total: '85.00', en: 'Late', ar: 'متأخرة', tone: 'danger' },
] as const;

/** Floating kit pieces around the pane: x, y on the floor and z above it, in cqi. */
const CHIPS = [
  { x: -40, y: -14, z: 30, html: 'ui-badge ui-badge--success', text: '7:1' },
  { x: 38, y: 10, z: 22, html: 'ui-badge', text: 'RTL' },
  { x: -30, y: 26, z: 12, html: 'ui-kbd', text: 'Tab' },
  { x: 30, y: -30, z: 38, html: 'ui-badge ui-badge--info', text: 'لمسة' },
];

/** WCAG contrast of two colours given as [r, g, b] in 0–255. */
export function contrast(a: number[], b: number[]): number {
  const lum = (c: number[]) => {
    const [r, g, bl] = c.map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * One live app screen standing on the floor, seen three ways: the front is the screen in English,
 * its reflection in the floor is the same screen in Arabic laid out right to left, and the back is
 * the screen as a screen reader gets it, with focus order and the contrast measured from the live
 * tokens. Drag sideways to turn it round, drag up or down to tilt; it glides on, then turns slowly.
 * Tap any part to light it on all three faces; the hint line under the scene names it and links
 * its page. The scene is decorative (aria-hidden); the hint line carries the name and link.
 */
@Component({
  selector: 'app-home-faces',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <div class="doc-ripple">
      <div
        #stage
        class="doc-ripple__stage"
        aria-hidden="true"
        [class.doc-ripple__stage--dragging]="dragging()"
        [class.doc-faces--behind]="behind()"
        (pointerdown)="down($event)"
        (pointermove)="move($event)"
        (pointerup)="up($event)"
        (pointercancel)="up(null)"
      >
        <div #world class="doc-ripple__world">
          <div class="doc-ripple__grid"></div>
          <div class="doc-ripple__floor"></div>
          @for (i of rings; track i) {
            <span class="doc-ripple__ring" [style.--i]="i"></span>
          }
          <div class="doc-ripple__orbit doc-ripple__orbit--a">
            <span class="doc-ripple__moon"></span>
          </div>
          <div class="doc-ripple__orbit doc-ripple__orbit--b">
            <span class="doc-ripple__moon"></span>
          </div>
          @for (w of waves(); track w.id) {
            <span
              class="doc-ripple__wave"
              [style.--x]="w.x"
              [style.--y]="w.y"
            ></span>
          }
          @for (c of chips; track c.text) {
            <span
              class="doc-faces__chip"
              [style.--x]="c.x"
              [style.--y]="c.y"
              [style.--z]="c.z"
              ><span [class]="c.html">{{ c.text }}</span></span
            >
          }

          <!-- The reflection: the same screen in Arabic, right to left, under the floor. -->
          <div class="doc-faces__mirror">
            <div
              class="doc-faces__face"
              [class.doc-faces__face--flip]="behind()"
              [attr.dir]="behind() ? 'ltr' : 'rtl'"
              [attr.lang]="behind() ? 'en' : 'ar'"
            >
              <ng-container
                *ngTemplateOutlet="
                  behind() ? back : screen;
                  context: { $implicit: 'ar' }
                "
              />
            </div>
          </div>

          <!-- The pane: the screen in English on the front, the screen reader's view on the back. -->
          <div class="doc-faces">
            <div class="doc-faces__face doc-faces__face--front" dir="ltr">
              <ng-container
                *ngTemplateOutlet="screen; context: { $implicit: 'en' }"
              />
            </div>
            <div class="doc-faces__face doc-faces__face--back" dir="ltr">
              <ng-container *ngTemplateOutlet="back" />
            </div>
          </div>
        </div>
      </div>
      <p class="ui-body-sm doc-ripple__hint" aria-live="polite">
        @if (picked(); as k) {
          <strong>{{ part(k).en }}</strong>:
          <span lang="ar">«{{ part(k).ar }}»</span> in Arabic, read out as
          {{ part(k).said }}.
          <a [routerLink]="path(k)">Open {{ part(k).page }}</a>
        } @else {
          Drag to turn it round. Tilt it to see it in Arabic. Tap any part.
        }
      </p>
    </div>

    <ng-template #screen let-lang>
      <div class="doc-faces__screen">
        <div class="doc-faces__bar">
          <strong
            class="ui-head-xs"
            data-key="title"
            [class.doc-faces--lit]="lit('title')"
            >{{ say(part('title'), lang) }}</strong
          >
          <button
            class="ui-button ui-button--primary ui-button--sm"
            tabindex="-1"
            data-key="add"
            [class.doc-faces--lit]="lit('add')"
          >
            {{ say(part('add'), lang) }}
          </button>
        </div>
        <div class="doc-faces__filters">
          <input
            class="ui-input"
            type="search"
            value="INV-10"
            tabindex="-1"
            data-key="search"
            [class.doc-faces--lit]="lit('search')"
          />
          <label
            class="ui-switch"
            data-key="paid"
            [class.doc-faces--lit]="lit('paid')"
          >
            {{ say(part('paid'), lang) }}
            <input
              type="checkbox"
              role="switch"
              class="ui-switch__input"
              tabindex="-1"
            />
          </label>
        </div>
        <table
          class="ui-table"
          data-key="table"
          [class.doc-faces--lit]="lit('table')"
        >
          <tbody>
            @for (r of invoices; track r.id) {
              <tr>
                <td>{{ r.id }}</td>
                <td>{{ r.total }}</td>
                <td>
                  <span
                    class="ui-badge ui-badge--{{ r.tone }}"
                    data-key="status"
                    [class.doc-faces--lit]="lit('status')"
                    >{{ say(r, lang) }}</span
                  >
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </ng-template>

    <ng-template #back>
      <div class="doc-faces__screen doc-faces__tree">
        <div class="doc-faces__bar">
          <span
            class="doc-faces__node"
            data-key="title"
            [class.doc-faces--lit]="lit('title')"
          >
            {{ part('title').said }} <b>{{ ratio()['title'] }}</b>
          </span>
          <span
            class="doc-faces__node"
            data-key="add"
            [class.doc-faces--lit]="lit('add')"
          >
            <i>1</i> {{ part('add').said }} <b>{{ ratio()['add'] }}</b>
          </span>
        </div>
        <div class="doc-faces__filters">
          <span
            class="doc-faces__node"
            data-key="search"
            [class.doc-faces--lit]="lit('search')"
          >
            <i>2</i> {{ part('search').said }} <b>{{ ratio()['search'] }}</b>
          </span>
          <span
            class="doc-faces__node"
            data-key="paid"
            [class.doc-faces--lit]="lit('paid')"
          >
            <i>3</i> {{ part('paid').said }} <b>{{ ratio()['paid'] }}</b>
          </span>
        </div>
        <div
          class="doc-faces__node doc-faces__node--table"
          data-key="table"
          [class.doc-faces--lit]="lit('table')"
        >
          {{ part('table').said }} <b>{{ ratio()['table'] }}</b>
          @for (r of invoices; track r.id) {
            <span
              class="doc-faces__row"
              data-key="status"
              [class.doc-faces--lit]="lit('status')"
              >row: {{ r.id }}, {{ r.total }}, “{{ r.en }}”
              <b>{{ ratio()[r.tone] }}</b></span
            >
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class HomeFacesComponent {
  protected readonly rings = RINGS;
  protected readonly invoices = INVOICES;
  protected readonly chips = CHIPS;
  protected readonly waves = signal<{ id: number; x: number; y: number }[]>([]);
  protected readonly dragging = signal(false);
  protected readonly picked = signal<PartKey | null>(null);
  /** True while the back of the pane faces you. */
  protected readonly behind = signal(false);
  /** Contrast of each front part, measured from the live tokens, e.g. { add: '7.4:1' }. */
  protected readonly ratio = signal<Record<string, string>>({});

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly world = viewChild.required<ElementRef<HTMLElement>>('world');
  private readonly still = matchMedia('(prefers-reduced-motion: reduce)');

  private rx = RX;
  private rz = RZ;
  /** How fast tilt and spin still move after a drag, in degrees per frame. */
  private vx = 0;
  private vz = 0;
  private start: { x: number; y: number } | null = null;
  private last = { x: 0, y: 0 };
  private moved = false;
  private restUntil = 0;
  private waveId = 0;
  private frame = 0;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      this.turn(0, 0);
      // Draw the 40rem scene at the stage's size.
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const fit = new ResizeObserver(([e]) =>
        this.world().nativeElement.style.setProperty(
          '--k',
          String(e.contentRect.width / (MODEL_REM * rem)),
        ),
      );
      fit.observe(this.stage().nativeElement);
      // Measure again whenever the theme changes.
      this.measure();
      const theme = new MutationObserver(() =>
        requestAnimationFrame(() => this.measure()),
      );
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class', 'style'],
      });
      destroy.onDestroy(() => {
        fit.disconnect();
        theme.disconnect();
      });
      // Reduced motion: no turning on its own and no glide; dragging still works.
      if (!this.still.matches) this.frame = requestAnimationFrame(this.tick);
    });
    destroy.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected part(k: PartKey) {
    return PARTS[k];
  }

  protected say(o: { en: string; ar: string }, lang: string): string {
    return lang === 'ar' ? o.ar : o.en;
  }

  protected path(k: PartKey): string {
    return pathOf(PARTS[k].page);
  }

  protected lit(k: PartKey): boolean {
    return this.picked() === k;
  }

  protected down(e: PointerEvent): void {
    if (e.button !== 0) return;
    // Keep focus out of the decorative scene: its parts work by pointer only.
    e.preventDefault();
    this.start = this.last = { x: e.clientX, y: e.clientY };
    this.moved = false;
    this.vx = this.vz = 0;
  }

  protected move(e: PointerEvent): void {
    if (!this.start) return;
    if (!this.moved) {
      if (Math.hypot(e.clientX - this.start.x, e.clientY - this.start.y) < TAP)
        return;
      this.moved = true;
      this.dragging.set(true);
      this.stage().nativeElement.setPointerCapture(e.pointerId);
    }
    // Drag sideways: it turns under the finger. Drag down: look from higher up.
    this.vz = -(e.clientX - this.last.x) * 0.4;
    this.vx = -(e.clientY - this.last.y) * 0.25;
    this.turn(this.vz, this.vx);
    this.last = { x: e.clientX, y: e.clientY };
    this.restUntil = performance.now() + REST;
  }

  protected up(e: PointerEvent | null): void {
    const tap = this.start && !this.moved;
    this.start = null;
    this.dragging.set(false);
    if (tap && e) this.touch(e);
  }

  /** One frame: glide after a drag, or turn slowly once it has rested. */
  private readonly tick = (t: number): void => {
    if (!this.start) {
      if (Math.abs(this.vz) > 0.02 || Math.abs(this.vx) > 0.02) {
        this.turn(this.vz, this.vx);
        this.vz *= 0.94;
        this.vx *= 0.88;
      } else if (t > this.restUntil) {
        this.turn(0.08, 0);
      }
    }
    this.frame = requestAnimationFrame(this.tick);
  };

  private turn(dz: number, dx: number): void {
    this.rz = (this.rz + dz) % 360;
    this.rx = Math.min(RX_MAX, Math.max(RX_MIN, this.rx + dx));
    const s = this.world().nativeElement.style;
    s.setProperty('--rx', `${this.rx.toFixed(2)}deg`);
    s.setProperty('--rz', `${this.rz.toFixed(2)}deg`);
    // The front faces you while the pane's normal points your way.
    const behind = Math.cos(rad(this.rz)) < 0;
    if (behind !== this.behind()) this.behind.set(behind);
  }

  /** Contrast of each front part's text on what is under it, from the live colours. */
  private measure(): void {
    const ink = document.createElement('canvas').getContext('2d', {
      willReadFrequently: true,
    });
    if (!ink) return;
    const rgb = (c: string) => {
      ink.clearRect(0, 0, 1, 1);
      ink.fillStyle = c;
      ink.fillRect(0, 0, 1, 1);
      return [...ink.getImageData(0, 0, 1, 1).data];
    };
    // The first opaque background at or above the element.
    const under = (el: Element | null): string => {
      for (; el; el = el.parentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        if (rgb(bg)[3] === 255) return bg;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const front = this.world().nativeElement.querySelector(
      '.doc-faces__face--front',
    );
    if (!front) return;
    const of = (el: Element | null) =>
      el
        ? `${contrast(rgb(getComputedStyle(el).color), rgb(under(el))).toFixed(1)}:1`
        : '';
    const q = (s: string) => front.querySelector(s);
    this.ratio.set({
      title: of(q('[data-key=title]')),
      add: of(q('[data-key=add]')),
      search: of(q('[data-key=search]')),
      paid: of(q('[data-key=paid]')),
      table: of(q('td')),
      success: of(q('.ui-badge--success')),
      warning: of(q('.ui-badge--warning')),
      danger: of(q('.ui-badge--danger')),
    });
  }

  /** A tap: light the part under the finger on every face, and send a ring out on the floor. */
  private touch(e: PointerEvent): void {
    const part = (e.target as Element).closest<HTMLElement>('[data-key]');
    this.picked.set((part?.dataset['key'] as PartKey | undefined) ?? null);
    if (this.still.matches) return;

    const r = this.stage().nativeElement.getBoundingClientRect();
    const cq = r.width / 100;
    // Undo the tilt to find the point on the floor under the finger.
    const dx = (e.clientX - r.left - r.width / 2) / cq;
    const dy = (e.clientY - r.top - r.height / 2) / cq / Math.cos(rad(this.rx));
    const a = -rad(this.rz);
    const clamp = (v: number) => Math.max(-48, Math.min(48, v));
    const x = clamp(dx * Math.cos(a) - dy * Math.sin(a));
    const y = clamp(dx * Math.sin(a) + dy * Math.cos(a));
    const id = ++this.waveId;
    this.waves.update((list) => [...list, { id, x, y }]);
    // A timer, not animationend: WebKit did not always fire it for this ring.
    setTimeout(
      () => this.waves.update((list) => list.filter((w) => w.id !== id)),
      1200,
    );
  }
}
