import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Framework } from '../shared/docs-settings';
import { FrameworkIconComponent } from '../shared/framework-icon.component';

/** Where the view starts, in degrees: tipped back, turned a little. */
const RX = 58;
const RZ = -20;
/** Tilt range: near 20° you look down on the pins, near 80° you are level with them. */
const RX_MIN = 20;
const RX_MAX = 80;
/** Ripples on the floor, each one wider and later than the last. */
const RINGS = [0, 1, 2, 3, 4, 5];
/** A tap moves less than this, in px; more is a drag. */
const TAP = 6;
/** After a drag the scene rests this long before it turns on its own again, in ms. */
const REST = 4000;
/** Pins sit this far apart, inside a bed of this radius, in cqi. */
const PITCH = 4.6;
const BED = 40;
/** Every pin shows at least this much, as a share of its full height. */
const STUB = 0.06;

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * What circles the board. The pins are the one stylesheet; each framework orbits it on its own
 * tilt and speed, and the two languages run round the floor. r and z in cqi, angles in degrees.
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
    r: 34,
    z: 16,
    tilt: 72,
    yaw: 0,
    period: 26,
    moons: [{ at: 0, fw: 'angular' }],
  },
  {
    id: 'react',
    r: 38,
    z: 14,
    tilt: 66,
    yaw: 55,
    period: 31,
    moons: [{ at: 120, fw: 'react' }],
  },
  {
    id: 'vue',
    r: 42,
    z: 12,
    tilt: 68,
    yaw: 110,
    period: 37,
    moons: [{ at: 220, fw: 'vue' }],
  },
  {
    id: 'html',
    r: 46,
    z: 12,
    tilt: 62,
    yaw: 155,
    period: 43,
    moons: [{ at: 300, fw: 'html' }],
  },
  {
    id: 'languages',
    r: 49,
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

/** The pins of a round bed, as x, y on the floor in cqi from the centre. */
const PINS = (() => {
  const out: { x: number; y: number }[] = [];
  const n = Math.floor(BED / PITCH);
  for (let i = -n; i <= n; i++)
    for (let j = -n; j <= n; j++) {
      // Every other row shifts half a pitch, so the pins pack like a real pin board.
      const x = (j + (i % 2 ? 0.5 : 0)) * PITCH;
      const y = i * PITCH * 0.87;
      if (Math.hypot(x, y) <= BED) out.push({ x, y });
    }
  return out;
})();

/**
 * A pin board, the touch toy, standing for the one stylesheet, with the frameworks and the two
 * languages on orbits round it: press and hold anywhere on the bed and the pins rise in the shape
 * of the touch, then settle back slowly. A quick tap sends a wave through them. Drag to turn and
 * tilt the board; it glides on, then turns slowly. Decorative (aria-hidden); the line under it
 * says how to use it.
 */
@Component({
  selector: 'app-home-pins',
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
              class="doc-pins__orbit"
              [class.doc-pins__orbit--flat]="!o.tilt"
              [style.--r]="o.r"
              [style.--z]="o.z"
              [style.--tilt]="o.tilt + 'deg'"
              [style.--yaw]="o.yaw + 'deg'"
              [style.--period]="o.period + 's'"
            >
              @for (m of o.moons; track m.at) {
                <span class="doc-pins__moon" [style.--at]="m.at + 'deg'">
                  @if (m.fw; as fw) {
                    <app-framework-icon [id]="fw" [where]="'orbit'" />
                  } @else {
                    <span [attr.lang]="m.lang">{{ m.text }}</span>
                  }
                </span>
              }
            </div>
          }
          <div class="doc-pins__bed"></div>
          @for (p of pins; track $index) {
            <span
              #pin
              class="doc-pins__pin"
              [attr.data-i]="$index"
              [style.--x]="p.x"
              [style.--y]="p.y"
              ><span class="doc-pins__shaft"></span
              ><span class="doc-pins__head"></span
            ></span>
          }
        </div>
      </div>
      <p class="ui-body-sm doc-ripple__hint">
        Press and hold the pins. Tap to send a wave, drag to turn the board.
      </p>
    </div>
  `,
})
export class HomePinsComponent {
  protected readonly rings = RINGS;
  protected readonly pins = PINS;
  protected readonly orbits = ORBITS;
  protected readonly waves = signal<{ id: number; x: number; y: number }[]>([]);
  protected readonly dragging = signal(false);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly world = viewChild.required<ElementRef<HTMLElement>>('world');
  private readonly pinEls = viewChildren<ElementRef<HTMLElement>>('pin');
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

  /** Where the finger presses on the floor, and since when; null when nothing is pressed. */
  private press: { x: number; y: number; at: number } | null = null;
  /** How far each pin is pushed up by touches (0–1), and what was last drawn. */
  private readonly held = new Float32Array(PINS.length);
  private readonly drawn = new Float32Array(PINS.length).fill(-1);
  /** Waves running through the pins after a tap. */
  private pinWaves: { x: number; y: number; at: number }[] = [];

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      this.turn(0, 0);
      this.frame = requestAnimationFrame(this.tick);
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
    this.press = { ...this.floorPoint(e), at: performance.now() };
  }

  protected move(e: PointerEvent): void {
    if (!this.start) return;
    if (!this.moved) {
      if (Math.hypot(e.clientX - this.start.x, e.clientY - this.start.y) < TAP)
        return;
      // It is a drag, not a press.
      this.moved = true;
      this.press = null;
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
    const press = this.press;
    this.press = null;
    this.start = null;
    this.dragging.set(false);
    // A quick tap: a wave through the pins and a ring on the floor.
    if (e && press && !this.moved && performance.now() - press.at < 220)
      this.tap(press);
  }

  /** One frame: turn the board, then raise and settle the pins. */
  private readonly tick = (t: number): void => {
    const still = this.still.matches;
    if (!this.start && !still) {
      if (Math.abs(this.vz) > 0.02 || Math.abs(this.vx) > 0.02) {
        this.turn(this.vz, this.vx);
        this.vz *= 0.94;
        this.vx *= 0.88;
      } else if (t > this.restUntil) {
        this.turn(0.06, 0);
      }
    }
    this.pinWaves = this.pinWaves.filter((w) => t - w.at < 1600);

    // A press pushes deeper and wider the longer it is held.
    const p = this.press;
    const hold = p ? Math.min(1, (t - p.at) / 1400) : 0;
    const reach = 5 + hold * 7;
    const lift = 0.45 + hold * 0.55;
    const els = this.pinEls();
    for (let i = 0; i < PINS.length; i++) {
      const pin = PINS[i];
      if (p) {
        const d = Math.hypot(pin.x - p.x, pin.y - p.y);
        const want = lift * Math.exp(-(d * d) / (reach * reach));
        if (want > this.held[i])
          this.held[i] = still
            ? want
            : this.held[i] + (want - this.held[i]) * 0.2;
      } else if (!still) {
        // Let go: the pins sink back slowly, like the real toy.
        this.held[i] *= 0.985;
      }
      let h = this.held[i];
      if (!still) {
        const d = Math.hypot(pin.x, pin.y);
        // At rest the bed breathes: a slow, low swell from the centre out.
        h += 0.035 * (1 + Math.sin(d * 0.22 - t * 0.0014));
        for (const w of this.pinWaves) {
          const age = t - w.at;
          const r = Math.hypot(pin.x - w.x, pin.y - w.y) - age * 0.045;
          h += 0.32 * Math.exp(-(r * r) / 14) * (1 - age / 1600);
        }
      }
      h = STUB + Math.min(1 - STUB, h);
      if (Math.abs(h - this.drawn[i]) > 0.002) {
        this.drawn[i] = h;
        els[i]?.nativeElement.style.setProperty('--h', h.toFixed(3));
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

  /** The point on the floor under the finger, in cqi from the centre. */
  private floorPoint(e: PointerEvent): { x: number; y: number } {
    // On a pin: exactly that pin.
    const pin = (e.target as Element).closest<HTMLElement>('[data-i]');
    if (pin) return PINS[Number(pin.dataset['i'])];
    // Elsewhere: undo the tilt and the turn (perspective left out, close enough).
    const r = this.stage().nativeElement.getBoundingClientRect();
    const cq = r.width / 100;
    const dx = (e.clientX - r.left - r.width / 2) / cq;
    const dy = (e.clientY - r.top - r.height / 2) / cq / Math.cos(rad(this.rx));
    const a = -rad(this.rz);
    return {
      x: dx * Math.cos(a) - dy * Math.sin(a),
      y: dx * Math.sin(a) + dy * Math.cos(a),
    };
  }

  private tap(at: { x: number; y: number }): void {
    if (this.still.matches) {
      // Reduced motion: no waves; a tap lets the pressed pins down at once.
      this.held.fill(0);
      return;
    }
    this.pinWaves.push({ ...at, at: performance.now() });
    const clamp = (v: number) => Math.max(-48, Math.min(48, v));
    const id = ++this.waveId;
    this.waves.update((list) => [
      ...list,
      { id, x: clamp(at.x), y: clamp(at.y) },
    ]);
    // A timer, not animationend: WebKit did not always fire it for this ring.
    setTimeout(
      () => this.waves.update((list) => list.filter((w) => w.id !== id)),
      1200,
    );
  }
}
