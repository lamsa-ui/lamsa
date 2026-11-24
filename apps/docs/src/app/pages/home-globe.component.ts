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
const R = 29;
const LIFT = 31;
/** Where the light comes from, as longitude and latitude in degrees: up and to the front left. */
const SUN = { lon: 60, lat: 35 };

const rad = (deg: number) => (deg * Math.PI) / 180;
/** The light's direction in the scene, in the same axes as the tiles (rotateZ of the +y axis). */
const SUN_DIR = [
  -Math.sin(rad(SUN.lon)) * Math.cos(rad(SUN.lat)),
  Math.cos(rad(SUN.lon)) * Math.cos(rad(SUN.lat)),
  Math.sin(rad(SUN.lat)),
];

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

/** Each framework circles the globe on its own tilted ring and speed. r in cqi, angles in degrees. */
const ORBITS: {
  fw: Framework;
  r: number;
  tilt: number;
  yaw: number;
  period: number;
  at: number;
}[] = [
  { fw: 'angular', r: 36, tilt: 72, yaw: 0, period: 26, at: 0 },
  { fw: 'react', r: 40, tilt: 64, yaw: 55, period: 31, at: 120 },
  { fw: 'vue', r: 44, tilt: 68, yaw: 110, period: 37, at: 220 },
  { fw: 'html', r: 48, tilt: 60, yaw: 155, period: 43, at: 300 },
];

/**
 * The library as a globe: every component is a point of light on it, in the light theme on the
 * day side and the dark theme on the night side, with smooth shading between; the frameworks
 * circle it as moons. Hover a point to read its name. Drag to turn and tilt it; it glides on,
 * then turns slowly. Tap a point to open that component's page, or the floor to send a ripple.
 * Decorative (aria-hidden): every page is also in the side bar.
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
        (pointerover)="hover($event)"
        (pointerout)="named.set(null)"
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
          @for (o of orbits; track o.fw) {
            <div
              class="doc-orbit"
              [style.--r]="o.r"
              [style.--z]="lift"
              [style.--tilt]="o.tilt + 'deg'"
              [style.--yaw]="o.yaw + 'deg'"
              [style.--period]="o.period + 's'"
            >
              <span class="doc-orbit__moon" [style.--at]="o.at + 'deg'">
                <app-framework-icon [id]="o.fw" [where]="'orbit'" />
              </span>
            </div>
          }
          <div
            #globe
            class="doc-globe"
            [style.--r]="radius"
            [style.--lift]="lift"
          >
            <span class="doc-globe__core"></span>
            @for (t of tiles; track t.path) {
              <span
                class="doc-globe__tile"
                [attr.data-theme]="t.light ? 'light' : 'dark'"
                [attr.data-path]="t.path"
                [style.--lat]="t.lat + 'deg'"
                [style.--lon]="t.lon + 'deg'"
              ></span>
            }
          </div>
        </div>
        @if (named(); as n) {
          <span
            class="doc-globe__name"
            [style.left.px]="n.x"
            [style.top.px]="n.y"
            >{{ n.label }}</span
          >
        }
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
  /** The component under the pointer, and where its point is in the stage, in px. */
  protected readonly named = signal<{
    label: string;
    x: number;
    y: number;
  } | null>(null);

  private readonly router = inject(Router);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly world = viewChild.required<ElementRef<HTMLElement>>('world');
  private readonly globe = viewChild.required<ElementRef<HTMLElement>>('globe');
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

  protected hover(e: PointerEvent): void {
    const tile = (e.target as Element).closest<HTMLElement>('[data-path]');
    if (!tile || this.start) return;
    const t = tile.getBoundingClientRect();
    const s = this.stage().nativeElement.getBoundingClientRect();
    this.named.set({
      label: TILES.find((x) => x.path === tile.dataset['path'])?.label ?? '',
      x: t.left + t.width / 2 - s.left,
      y: t.top - s.top,
    });
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
    this.named.set(null);
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
    // Where the light falls on the globe as you see it: the sun turned with the scene.
    const [x, y, z] = SUN_DIR;
    const [cz, sz, cx, sx] = [
      Math.cos(rad(this.rz)),
      Math.sin(rad(this.rz)),
      Math.cos(rad(this.rx)),
      Math.sin(rad(this.rx)),
    ];
    const g = this.globe().nativeElement.style;
    g.setProperty('--sx', (x * cz - y * sz).toFixed(3));
    g.setProperty('--sy', ((x * sz + y * cz) * cx - z * sx).toFixed(3));
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
    // The floor sits 8cqi below the stage centre (translateY on .doc-ripple__world).
    const dy =
      ((e.clientY - r.top - r.height / 2) / cq - 8) / Math.cos(rad(this.rx));
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
