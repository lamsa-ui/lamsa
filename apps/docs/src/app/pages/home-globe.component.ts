import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Framework } from '../shared/docs-settings';
import { FrameworkIconComponent } from '../shared/framework-icon.component';
import { COMPONENTS } from '../shared/nav';

/** Where the view starts, in degrees: tipped back, turned a little. */
const RX = 66;
const RZ = -20;
/** Tilt range: near 20° you look down on the globe, near 84° you are level with the floor. */
const RX_MIN = 20;
const RX_MAX = 84;
/** Ripples on the floor, each one wider and later than the last. */
const RINGS = [0, 1, 2, 3, 4, 5];
/** A tap moves less than this, in px; more is a drag. */
const TAP = 6;
/** After a drag the scene rests this long before it turns on its own again, in ms. */
const REST = 4000;
/** The globe's radius and the height of its centre over the floor, in cqi. */
const R = 24;
const LIFT = 26;
/** Where the light comes from, as longitude and latitude in degrees: that half is day. */
const SUN = { lon: -70, lat: 20 };

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * One tile per component, spread evenly over the globe (a Fibonacci sphere). Tiles on the sunny
 * side are drawn in the light theme, the rest in the dark theme.
 */
const TILES = COMPONENTS.map((c, i, all) => {
  const lat = Math.asin(1 - (2 * (i + 0.5)) / all.length);
  const lon = rad(i * 137.508);
  const sun = [rad(SUN.lon), rad(SUN.lat)];
  const light =
    Math.cos(lat) * Math.cos(sun[1]) * Math.cos(lon - sun[0]) +
      Math.sin(lat) * Math.sin(sun[1]) >
    0;
  return {
    label: c.label,
    path: c.path,
    lat: (lat * 180) / Math.PI,
    lon: (lon * 180) / Math.PI,
    light,
  };
});

/**
 * What circles the globe: each framework on its own tilted ring and speed, and the two languages
 * on the floor. r and z in cqi, angles in degrees.
 */
const ORBITS: {
  id: string;
  r: number;
  z: number;
  tilt: number;
  yaw: number;
  period: number;
  moons: { at: number; fw?: Framework; text?: string; lang?: string }[];
}[] = [
  {
    id: 'angular',
    r: 32,
    z: LIFT,
    tilt: 72,
    yaw: 0,
    period: 26,
    moons: [{ at: 0, fw: 'angular' }],
  },
  {
    id: 'react',
    r: 36,
    z: LIFT,
    tilt: 64,
    yaw: 55,
    period: 31,
    moons: [{ at: 120, fw: 'react' }],
  },
  {
    id: 'vue',
    r: 40,
    z: LIFT,
    tilt: 68,
    yaw: 110,
    period: 37,
    moons: [{ at: 220, fw: 'vue' }],
  },
  {
    id: 'html',
    r: 44,
    z: LIFT,
    tilt: 60,
    yaw: 155,
    period: 43,
    moons: [{ at: 300, fw: 'html' }],
  },
  {
    id: 'languages',
    r: 48,
    z: 1,
    tilt: 0,
    yaw: 0,
    period: 60,
    moons: [
      { at: 0, text: 'ع', lang: 'ar' },
      { at: 180, text: 'A', lang: 'en' },
    ],
  },
];

/**
 * The library as a globe: every component is a tile on it, the light theme on its day side and
 * the dark theme on its night side; the frameworks circle it as moons and the two languages run
 * round the floor. Drag to turn and tilt it; it glides on, then turns slowly. Tap a tile to open
 * that component's page, or the floor to send a ripple. Decorative (aria-hidden): every page is
 * also in the side bar.
 */
@Component({
  selector: 'app-home-globe',
  imports: [FrameworkIconComponent],
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
          @for (w of waves(); track w.id) {
            <span
              class="doc-ripple__wave"
              [style.--x]="w.x"
              [style.--y]="w.y"
            ></span>
          }
          @for (o of orbits; track o.id) {
            <div
              class="doc-orbit"
              [class.doc-orbit--flat]="!o.tilt"
              [style.--r]="o.r"
              [style.--z]="o.z"
              [style.--tilt]="o.tilt + 'deg'"
              [style.--yaw]="o.yaw + 'deg'"
              [style.--period]="o.period + 's'"
            >
              @for (m of o.moons; track m.at) {
                <span class="doc-orbit__moon" [style.--at]="m.at + 'deg'">
                  @if (m.fw; as fw) {
                    <app-framework-icon [id]="fw" [where]="'orbit'" />
                  } @else {
                    <span [attr.lang]="m.lang">{{ m.text }}</span>
                  }
                </span>
              }
            </div>
          }
          <div class="doc-globe" [style.--r]="radius" [style.--lift]="lift">
            <span class="doc-globe__core"></span>
            @for (t of tiles; track t.path) {
              <span
                class="doc-globe__tile"
                [attr.data-theme]="t.light ? 'light' : 'dark'"
                [attr.data-path]="t.path"
                [style.--lat]="t.lat + 'deg'"
                [style.--lon]="t.lon + 'deg'"
                >{{ t.label }}</span
              >
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeGlobeComponent {
  protected readonly rings = RINGS;
  protected readonly tiles = TILES;
  protected readonly orbits = ORBITS;
  protected readonly radius = R;
  protected readonly lift = LIFT;
  protected readonly waves = signal<{ id: number; x: number; y: number }[]>([]);
  protected readonly dragging = signal(false);

  private readonly router = inject(Router);
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
      // Reduced motion: no turning on its own and no glide; dragging still works.
      if (!this.still.matches) this.frame = requestAnimationFrame(this.tick);
    });
    destroy.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected down(e: PointerEvent): void {
    if (e.button !== 0) return;
    // Keep focus out of the decorative scene.
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
  }

  /** A tap: a tile opens its page; anywhere else sends a ring out on the floor. */
  private touch(e: PointerEvent): void {
    const tile = (e.target as Element).closest<HTMLElement>('[data-path]');
    if (tile) {
      this.router.navigateByUrl(tile.dataset['path'] ?? '/');
      return;
    }
    if (this.still.matches) return;

    const r = this.stage().nativeElement.getBoundingClientRect();
    const cq = r.width / 100;
    // Undo the tilt and the turn to find the point on the floor under the finger.
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
