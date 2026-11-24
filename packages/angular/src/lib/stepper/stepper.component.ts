import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  contentChildren,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/** One step: its name, and the content shown while it is the current step. */
@Component({
  selector: 'ui-step',
  template: `<ng-template><ng-content /></ng-template>`,
})
export class StepComponent {
  readonly label = input.required<string>();
  /**
   * Whether the step is filled in, such as its form being valid. In a linear stepper, Next
   * and the later steps wait for it. A step before the current one shows a tick only when
   * it is completed.
   */
  readonly completed = input(true);
  readonly content = viewChild.required(TemplateRef);
}

let nextId = 0;

/**
 * A flow split into steps, such as checkout. Each step holds its own content; the stepper
 * shows the current one with Back and Next under it, and Next on the last step says
 * Finish. The step names are buttons, so people can go back to a step. With `linear`, a
 * step can only be reached once every step before it is completed, and Next on a step
 * that is not emits `blocked`, so you can show its errors. After a change, focus moves to
 * the new step's content. Steps you leave keep what was typed in them.
 *
 * ```html
 * <ui-stepper label="Checkout" linear [(current)]="step" (blocked)="showErrors($event)" (finish)="pay()">
 *   <ui-step label="Address" [completed]="address.valid">…</ui-step>
 *   <ui-step label="Payment" [completed]="card.valid">…</ui-step>
 * </ui-stepper>
 * ```
 */
@Component({
  selector: 'ui-stepper',
  imports: [IconComponent, NgTemplateOutlet, ButtonComponent],
  host: { class: 'ui-stepper' },
  template: `
    <ol class="ui-steps" [attr.aria-label]="label()">
      @for (step of steps(); track step; let i = $index) {
        @let done = i < current() && step.completed();
        <li
          class="ui-steps__item"
          [class.ui-steps__item--done]="done"
          [class.ui-steps__item--current]="i === current()"
        >
          <button
            type="button"
            class="ui-steps__step"
            [id]="id + '-step-' + i"
            [attr.aria-current]="i === current() ? 'step' : null"
            [disabled]="!reachable(i)"
            (click)="go(i)"
          >
            <span class="ui-steps__marker" aria-hidden="true">
              @if (done) {
                <ui-icon name="check" />
              } @else {
                {{ number()(i + 1) }}
              }
            </span>
            <span class="ui-steps__label">
              @if (done) {
                <span class="ui-visually-hidden">{{ doneLabel() }}: </span>
              }
              {{ step.label() }}
            </span>
          </button>
        </li>
      }
    </ol>
    @for (step of steps(); track step; let i = $index) {
      <section
        #panel
        class="ui-stepper__panel"
        tabindex="-1"
        [attr.aria-labelledby]="id + '-step-' + i"
        [hidden]="i !== current()"
      >
        <ng-container [ngTemplateOutlet]="step.content()" />
      </section>
    }
    <div class="ui-stepper__actions">
      @if (current() > 0) {
        <button
          ui-button
          variant="secondary"
          type="button"
          (click)="go(current() - 1)"
        >
          {{ backLabel() }}
        </button>
      }
      <button ui-button type="button" (click)="next()">
        {{ current() === steps().length - 1 ? finishLabel() : nextLabel() }}
      </button>
    </div>
  `,
})
export class StepperComponent {
  /** Names the list of steps: "Checkout". */
  readonly label = input.required<string>();
  /** Index of the current step, from 0; two-way with `[(current)]`. */
  readonly current = model(0);
  /** Steps are reached in order: each waits for the ones before it to be completed. */
  readonly linear = input(false, { transform: booleanAttribute });
  /** Read before each done step. Translate it, and the button labels. */
  readonly doneLabel = input('Done');
  readonly backLabel = input('Back');
  readonly nextLabel = input('Next');
  readonly finishLabel = input('Finish');
  /** The marker's number: (n) => n.toLocaleString('ar-EG') for Arabic digits. */
  readonly number = input<(n: number) => string>(String);

  /** Finish was pressed on the last step (in a linear stepper, only once it is completed). */
  readonly finish = output<void>();
  /** In a linear stepper, Next or Finish was pressed on this step while it is not completed. */
  readonly blocked = output<number>();

  protected readonly id = `ui-stepper-${nextId++}`;
  protected readonly steps = contentChildren(StepComponent);
  private readonly panels = viewChildren<ElementRef<HTMLElement>>('panel');
  private readonly injector = inject(Injector);

  protected reachable(i: number): boolean {
    return (
      !this.linear() ||
      this.steps()
        .slice(0, i)
        .every((step) => step.completed())
    );
  }

  protected go(i: number): void {
    if (i === this.current()) return;
    this.current.set(i);
    // The new panel is shown on the next render; focus lands there for screen readers.
    afterNextRender(() => this.panels()[i]?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected next(): void {
    const i = this.current();
    if (this.linear() && !this.steps()[i]?.completed()) {
      this.blocked.emit(i);
    } else if (i === this.steps().length - 1) {
      this.finish.emit();
    } else {
      this.go(i + 1);
    }
  }
}
