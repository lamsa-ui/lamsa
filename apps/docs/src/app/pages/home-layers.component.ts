import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV } from '../shared/nav';

/** Where the model starts, in degrees: tipped back, turned a little. */
const RX = 50;
const RZ = -18;
/** Tilt range: near 10° it reads as a flat screen, near 72° the layers stand far apart. */
const RX_MIN = 10;
const RX_MAX = 72;
/** Ripples on the floor, each one wider and later than the last. */
const RINGS = [0, 1, 2, 3, 4, 5];
/** A tap moves less than this, in px; more is a drag. */
const TAP = 6;
/** After a drag the scene rests this long before it turns on its own again, in ms. */
const REST = 4000;
/** The model is drawn 40rem wide and scaled to the stage. */
const MODEL_REM = 40;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pathOf = (label: string) =>
  NAV.flatMap((g) => g.links).find((l) => l.label === label)?.path ??
  '/getting-started';

/** The four layers, bottom first. */
const LAYERS = [
  { id: 'tokens', label: 'Tokens', path: pathOf('Colour') },
  { id: 'css', label: 'ui.css', path: pathOf('Getting started') },
  { id: 'components', label: 'Components', path: pathOf('Button') },
  { id: 'frameworks', label: 'Frameworks', path: pathOf('Getting started') },
] as const;
type LayerId = (typeof LAYERS)[number]['id'];

/** The same button in each framework, as on the Button page. */
const CODE = [
  { fw: 'Angular', code: '<button ui-button>New invoice</button>' },
  { fw: 'React', code: '<Button>New invoice</Button>' },
  { fw: 'Vue', code: '<Button>New invoice</Button>' },
  {
    fw: 'HTML',
    code: '<button class="ui-button ui-button--primary ui-button--md">New invoice</button>',
  },
];

/** Real lines from ui.css: the rule every switch above is drawn with. */
const CSS = `.ui-switch {
  display: flex;
  align-items: center;
  gap: var(--ui-space-4);
  min-block-size: var(--ui-control-height);
}`;

const INVOICES = [
  { id: 'INV-1042', total: '1,200.00', status: 'Paid', tone: 'success' },
  { id: 'INV-1041', total: '340.00', status: 'Due', tone: 'warning' },
  { id: 'INV-1040', total: '85.00', status: 'Late', tone: 'danger' },
];

/**
 * The library as an exploded model: a live app screen built from kit components, standing on
 * the stylesheet and the tokens under it, with the four frameworks as glass on top. Drag sideways
 * to turn it, drag down to tip it back and pull the layers apart; it glides on, then turns slowly.
 * Tap any part to lift its layer and name it, with a link to its page under the scene.
 * The scene is decorative (aria-hidden); the hint line under it carries the name and link.
 */
@Component({
  selector: 'app-home-layers',
  imports: [RouterLink],
  template: `
    <div class="doc-ripple">
      <div
        #stage
        class="doc-ripple__stage"
        aria-hidden="true"
        [class.doc-ripple__stage--dragging]="dragging()"
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

          <div #model class="doc-layers">
            @for (l of layers; track l.id; let i = $index) {
              <div
                class="doc-layers__slab doc-layers__slab--{{ l.id }}"
                [class.doc-layers__slab--lifted]="picked()?.layer === l.id"
                [style.--i]="i"
              >
                <span
                  class="doc-layers__tag"
                  [attr.data-part]="l.label"
                  [attr.data-path]="l.path"
                  [attr.data-layer]="l.id"
                  >{{ l.label }}</span
                >
                @switch (l.id) {
                  @case ('tokens') {
                    <div class="doc-layers__tokens">
                      <div class="doc-layers__swatches">
                        @for (s of swatches; track s) {
                          <span [style.background]="'var(' + s + ')'"></span>
                        }
                      </div>
                      <span class="doc-layers__aa">Aa</span>
                      <div class="doc-layers__space">
                        <span style="inline-size: 1rem"></span>
                        <span style="inline-size: 2rem"></span>
                        <span style="inline-size: 4rem"></span>
                      </div>
                      <span class="ui-badge ui-badge--success">7:1</span>
                    </div>
                  }
                  @case ('css') {
                    <pre class="doc-layers__css">{{ css }}</pre>
                  }
                  @case ('components') {
                    <div class="doc-layers__screen">
                      <div class="doc-layers__bar">
                        <strong class="ui-head-xs">Invoices</strong>
                        <button
                          class="ui-button ui-button--primary ui-button--sm"
                          tabindex="-1"
                          data-part="Button"
                          [attr.data-path]="path('Button')"
                          data-layer="components"
                        >
                          New invoice
                        </button>
                      </div>
                      <div class="doc-layers__filters">
                        <input
                          class="ui-input"
                          type="search"
                          value="INV-10"
                          tabindex="-1"
                          data-part="Search field"
                          [attr.data-path]="path('Search field')"
                          data-layer="components"
                        />
                        <label
                          class="ui-switch"
                          data-part="Switch"
                          [attr.data-path]="path('Switch')"
                          data-layer="components"
                        >
                          Paid only
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
                        data-part="Data table"
                        [attr.data-path]="path('Data table')"
                        data-layer="components"
                      >
                        <tbody>
                          @for (r of invoices; track r.id) {
                            <tr>
                              <td>{{ r.id }}</td>
                              <td>{{ r.total }}</td>
                              <td>
                                <span
                                  class="ui-badge ui-badge--{{ r.tone }}"
                                  data-part="Badge"
                                  [attr.data-path]="path('Badge')"
                                  data-layer="components"
                                  >{{ r.status }}</span
                                >
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                  @default {
                    <div class="doc-layers__glass">
                      <div class="doc-layers__tabs">
                        @for (c of code; track c.fw; let j = $index) {
                          <span
                            [class.doc-layers__tab--on]="j === fwAt()"
                            data-part="Frameworks"
                            [attr.data-path]="path('Getting started')"
                            data-layer="frameworks"
                            (pointerup)="pickFramework(j)"
                            >{{ c.fw }}</span
                          >
                        }
                      </div>
                      <code class="doc-layers__code">{{ current().code }}</code>
                    </div>
                  }
                }
              </div>
            }
          </div>
        </div>
      </div>
      <p class="ui-body-sm doc-ripple__hint" aria-live="polite">
        @if (picked(); as p) {
          <strong>{{ p.label }}</strong>, on the {{ layerName(p.layer) }} layer.
          <a [routerLink]="p.path">Open {{ p.label }}</a>
        } @else {
          Drag to turn it, drag down to pull the layers apart. Tap any part.
        }
      </p>
    </div>
  `,
})
export class HomeLayersComponent {
  protected readonly layers = LAYERS;
  protected readonly rings = RINGS;
  protected readonly invoices = INVOICES;
  protected readonly code = CODE;
  protected readonly css = CSS;
  protected readonly swatches = [
    '--ui-primary',
    '--ui-danger',
    '--ui-success',
    '--ui-warning',
    '--ui-text',
    '--ui-border',
  ];
  protected readonly waves = signal<{ id: number; x: number; y: number }[]>([]);
  protected readonly dragging = signal(false);
  protected readonly picked = signal<{
    label: string;
    path: string;
    layer: LayerId;
  } | null>(null);
  protected readonly fwAt = signal(0);
  protected readonly current = computed(() => CODE[this.fwAt() % CODE.length]);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly world = viewChild.required<ElementRef<HTMLElement>>('world');
  private readonly model = viewChild.required<ElementRef<HTMLElement>>('model');
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
      // Draw the 40rem model at the stage's size.
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const fit = new ResizeObserver(([e]) =>
        this.model().nativeElement.style.setProperty(
          '--k',
          String(e.contentRect.width / (MODEL_REM * rem)),
        ),
      );
      fit.observe(this.stage().nativeElement);
      destroy.onDestroy(() => fit.disconnect());
      // Reduced motion: no turning on its own, no glide, no tab cycling; dragging still works.
      if (!this.still.matches) {
        this.frame = requestAnimationFrame(this.tick);
        const tabs = setInterval(() => this.fwAt.update((n) => n + 1), 2400);
        destroy.onDestroy(() => clearInterval(tabs));
      }
    });
    destroy.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected path(label: string): string {
    return pathOf(label);
  }

  protected layerName(id: LayerId): string {
    return LAYERS.find((l) => l.id === id)?.label ?? id;
  }

  protected pickFramework(j: number): void {
    if (!this.moved) this.fwAt.set(j);
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
    // Drag sideways: it spins under the finger. Drag down: look from higher up, layers part.
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
        this.turn(0.05, 0);
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
    // How far apart the layers stand: 0 seen face on, 1 tipped right back.
    s.setProperty(
      '--open',
      ((this.rx - RX_MIN) / (RX_MAX - RX_MIN)).toFixed(3),
    );
  }

  /** A tap: name the part under the finger, lift its layer, and send a ring out on the floor. */
  private touch(e: PointerEvent): void {
    const part = (e.target as Element).closest<HTMLElement>('[data-part]');
    this.picked.set(
      part
        ? {
            label: part.dataset['part'] ?? '',
            path: part.dataset['path'] ?? '/getting-started',
            layer: part.dataset['layer'] as LayerId,
          }
        : null,
    );
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
