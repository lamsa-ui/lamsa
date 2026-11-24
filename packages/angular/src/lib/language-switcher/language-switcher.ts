import { CdkMenu, CdkMenuItemRadio } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { ButtonComponent, type ButtonSize } from '../button/button.component';
import { MenuTriggerDirective } from '../menu/menu';
import { IconComponent } from '../icon/icon.component';
import { UI_LABELS } from '../labels';

export interface Language {
  /** The language tag, such as 'en' or 'ar'. */
  code: string;
  /** The language's name in that language: 'English', 'عربي'. */
  name: string;
}

/**
 * Switches the interface language. With two languages it is one button that names the
 * other one in that language (a reader of it can find it); with more it opens a menu with
 * the current one checked. Each name carries its `lang`, so screen readers say it right.
 * Set `<html lang dir>` yourself when `current` changes.
 *
 * ```html
 * <ui-language-switcher [languages]="languages" [(current)]="language" />
 * ```
 */
@Component({
  selector: 'ui-language-switcher',
  imports: [
    IconComponent,
    ButtonComponent,
    CdkMenu,
    CdkMenuItemRadio,
    MenuTriggerDirective,
    NgTemplateOutlet,
  ],
  template: `
    <ng-template #globe>
      <ui-icon name="globe" size="sm" />
    </ng-template>
    @if (other(); as other) {
      <button
        ui-button
        variant="secondary"
        type="button"
        [size]="size()"
        [attr.lang]="other.code"
        (click)="current.set(other.code)"
      >
        <ng-container [ngTemplateOutlet]="globe" />
        {{ other.name }}
      </button>
    } @else {
      <button
        ui-button
        variant="secondary"
        type="button"
        [size]="size()"
        [uiMenuTrigger]="list"
      >
        <ng-container [ngTemplateOutlet]="globe" />
        <span class="ui-visually-hidden">{{ labelText() }}: </span>
        <span [attr.lang]="active()?.code">{{ active()?.name }}</span>
      </button>
      <ng-template #list>
        <div cdkMenu class="ui-menu" [attr.aria-label]="labelText()">
          @for (language of languages(); track language.code) {
            <button
              cdkMenuItemRadio
              class="ui-menu__item"
              type="button"
              [cdkMenuItemChecked]="language.code === current()"
              [attr.lang]="language.code"
              (cdkMenuItemTriggered)="current.set(language.code)"
            >
              {{ language.name }}
            </button>
          }
        </div>
      </ng-template>
    }
  `,
})
export class LanguageSwitcherComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** The languages, each named in itself. */
  readonly languages = input.required<readonly Language[]>();
  /** The current language's code; two-way with `[(current)]`. */
  readonly current = model.required<string>();
  /** The menu's name, for three or more languages; translate it. */
  readonly label = input<string>();
  protected readonly labelText = computed(
    () => this.label() ?? this.uiLabels().language,
  );
  readonly size = input<ButtonSize>('md');

  protected readonly other = computed(() => {
    const languages = this.languages();
    return languages.length === 2
      ? languages.find((l) => l.code !== this.current())
      : undefined;
  });
  protected readonly active = computed(() =>
    this.languages().find((l) => l.code === this.current()),
  );
}
