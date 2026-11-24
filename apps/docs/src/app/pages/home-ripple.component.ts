import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { COMPONENTS } from '../shared/nav';

/** The mark's three pieces, tallest last: how many layers each is extruded from, and how far out it sits (cqi). */
const PIECES = [
  { id: 'arc', layers: 3, reach: 20 },
  { id: 'ring', layers: 7, reach: 13 },
  { id: 'dot', layers: 12, reach: 6 },
] as const;

/**
 * The pin field: one pin per component, in side-bar order, nearest the mark first. Pins sit on a
 * --ui-space-8 grid: 2rem on a 40rem stage is 5cqi, half the floor's 4rem (--ui-space-16) lines.
 */
const PITCH = 5;
const PINS = Array.from({ length: 21 * 21 }, (_, i) => ({
  x: (Math.floor(i / 21) - 10) * PITCH,
  y: ((i % 21) - 10) * PITCH,
}))
  .map((p) => ({ ...p, r: Math.hypot(p.x, p.y), a: Math.atan2(p.y, p.x) }))
  .filter((p) => p.r > 23)
  .sort((p, q) => p.r - q.r || p.a - q.a)
  .slice(0, COMPONENTS.length)
  .map((p, i) => ({ ...p, label: COMPONENTS[i].label }));

/** Where the floor starts, in degrees: tipped back, turned a little. */
const RX = 58;
const RZ = -14;
/** Ripples on the floor, each one wider and later than the last. */
const RINGS = [0, 1, 2, 3, 4, 5];
/** How fast the wave travels outward from a touch, in ms per cqi. */
const SPEED = 14;
/** A tap moves less than this, in px; more is a drag. */
const TAP = 6;
/** After a drag the scene rests this long before it turns on its own again, in ms. */
const REST = 4000;

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * The Lamsa mark as a frozen ripple: the red dot is a raised pin, the blue ring and the open arc
 * stand lower, each extruded from stacked layers (CSS 3D, no WebGL). It stands on a blueprint
 * floor with ripples, orbits and a field of pins that rise as each ripple passes under them.
 * Drag to turn and tilt it freely and it glides on; a tap sends a wave from the finger, and the
 * pins and pieces lift as it reaches them.
 * Decorative: the page's content is the intro beside it.
 */
@Component({
  selector: 'app-home-ripple',
  template: `
    <div class="doc-ripple" aria-hidden="true">
      <div
        #stage
        class="doc-ripple__stage"
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
          <div class="doc-ripple__mark">
            @for (p of pieces; track p.id) {
              <div
                class="doc-ripple__piece doc-ripple__piece--{{ p.id }}"
                [attr.data-reach]="p.reach"
              >
                <div class="doc-ripple__inner">
                  @for (n of layers(p.layers); track n) {
                    <svg
                      viewBox="0 0 64 64"
                      [style.--i]="n"
                      [style.--n]="p.layers"
                    >
                      @switch (p.id) {
                        @case ('dot') {
                          <circle cx="32" cy="32" r="7.5" fill="#DC4B4B" />
                        }
                        @case ('ring') {
                          <circle
                            cx="32"
                            cy="32"
                            r="17"
                            fill="none"
                            stroke="#0059FF"
                            stroke-width="5"
                          />
                        }
                        @default {
                          <path
                            d="M32 5 A27 27 0 1 1 8.6 18.5"
                            fill="none"
                            stroke="#0059FF"
                            stroke-width="5"
                            stroke-linecap="round"
                          />
                        }
                      }
                    </svg>
                  }
                </div>
              </div>
            }
          </div>
          @for (p of pins; track $index) {
            <span
              class="doc-pin"
              [style.--x]="p.x"
              [style.--y]="p.y"
              [style.--r]="p.r"
              [class.doc-pin--picked]="picked() === p.label"
            ></span>
          }
        </div>
      </div>
      <p class="ui-body-sm doc-ripple__hint">
        @if (picked(); as name) {
          <strong>{{ name }}</strong>, one of {{ pins.length }} components: one
          pin each.
        } @else {
          Drag to turn it. Tap a pin: there is one per component.
        }
      </p>
    </div>
  `,
})
export class HomeRippleComponent {
  protected readonly pieces = PIECES;
  protected readonly pins = PINS;
  protected readonly rings = RINGS;
  protected readonly waves = signal<{ id: number; x: number; y: number }[]>([]);
  protected readonly dragging = signal(false);
  /** The component whose pin is nearest the last tap. */
  protected readonly picked = signal<string | null>(null);

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
    afterNextRender(() => {
      this.turn(0, 0);
      // Reduced motion: no turning on its own and no glide; dragging still works.
      if (!this.still.matches) this.frame = requestAnimationFrame(this.tick);
    });
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected layers(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  protected down(e: PointerEvent): void {
    if (e.button !== 0) return;
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
    // Drag sideways: the floor spins under the finger. Drag down: look from higher up.
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
    this.rx = Math.min(72, Math.max(18, this.rx + dx));
    const s = this.world().nativeElement.style;
    s.setProperty('--rx', `${this.rx.toFixed(2)}deg`);
    s.setProperty('--rz', `${this.rz.toFixed(2)}deg`);
  }

  private drop(id: number): void {
    this.waves.update((list) => list.filter((w) => w.id !== id));
  }

  /** A tap: a ring spreads from the finger on the floor, and each pin and piece lifts as the wave reaches it. */
  private touch(e: PointerEvent): void {
    const r = this.stage().nativeElement.getBoundingClientRect();
    const cq = r.width / 100;
    // Undo the tilt to find the point on the floor under the finger.
    const dx = (e.clientX - r.left - r.width / 2) / cq;
    const dy = (e.clientY - r.top - r.height / 2) / cq / Math.cos(rad(this.rx));
    const a = -rad(this.rz);
    const clamp = (v: number) => Math.max(-48, Math.min(48, v));
    const x = clamp(dx * Math.cos(a) - dy * Math.sin(a));
    const y = clamp(dx * Math.sin(a) + dy * Math.cos(a));
    const from = Math.hypot(x, y);
    const near = (p: { x: number; y: number }) => Math.hypot(p.x - x, p.y - y);
    this.picked.set(
      PINS.reduce((best, p) => (near(p) < near(best) ? p : best)).label,
    );
    // Reduced motion: the pin is still picked and named, but no wave runs.
    if (this.still.matches) return;

    for (const el of this.world().nativeElement.querySelectorAll<HTMLElement>(
      '.doc-ripple__piece',
    )) {
      const reach = Number(el.dataset['reach']);
      el.animate([{ '--glow': 0 }, { '--glow': 1 }, { '--glow': 0 }], {
        duration: 900,
        delay: Math.max(0, from - reach) * SPEED,
        easing: 'ease-out',
      });
    }
    for (const el of this.world().nativeElement.querySelectorAll<HTMLElement>(
      '.doc-pin',
    )) {
      const d = Math.hypot(
        Number(el.style.getPropertyValue('--x')) - x,
        Number(el.style.getPropertyValue('--y')) - y,
      );
      el.animate([{ '--glow': 0 }, { '--glow': 1 }, { '--glow': 0 }], {
        duration: 700,
        delay: d * SPEED,
        easing: 'ease-out',
      });
    }
    const id = ++this.waveId;
    this.waves.update((list) => [...list, { id, x, y }]);
    // A timer, not animationend: WebKit did not always fire it for this ring.
    setTimeout(() => this.drop(id), 1200);
  }
}
