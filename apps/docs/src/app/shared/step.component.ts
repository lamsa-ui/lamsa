import { Component, input, model } from '@angular/core';

let nextId = 0;

/** The sticky slider every live demo uses. The readout goes inside, as content. */
@Component({
  selector: 'app-step',
  host: { class: 'ui-field doc-step' },
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <input
      [id]="id"
      class="doc-step__range"
      type="range"
      [min]="min()"
      [max]="max()"
      [value]="value()"
      [attr.aria-valuetext]="valuetext()"
      (input)="value.set(+$any($event.target).value)"
    />
    <output [for]="id" class="doc-step__value"><ng-content /></output>
  `,
})
export class StepComponent {
  protected readonly id = `doc-step-${nextId++}`;
  readonly label = input.required<string>();
  readonly min = input(0);
  readonly max = input.required<number>();
  readonly valuetext = input.required<string>();
  readonly value = model.required<number>();
}
