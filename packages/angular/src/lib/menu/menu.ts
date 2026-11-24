import {
  CdkContextMenuTrigger,
  CdkMenu,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import type { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  Component,
  Directive,
  inject,
  input,
} from '@angular/core';

/**
 * Opens a menu from a button, on the Angular CDK: Enter, Space or the down arrow open
 * it, arrow keys and typing move through it, Escape closes it and focus returns here.
 *
 * ```html
 * <button ui-button variant="secondary" [uiMenuTrigger]="actions">Actions</button>
 * <ng-template #actions>
 *   <ui-menu>
 *     <button ui-menu-item (triggered)="edit()">Edit</button>
 *     <button ui-menu-item danger (triggered)="remove()">Delete</button>
 *   </ui-menu>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[uiMenuTrigger]',
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: uiMenuTrigger'],
    },
  ],
})
export class MenuTriggerDirective {
  constructor() {
    openInline(inject(CdkMenuTrigger, { self: true }));
  }
}

/**
 * Opens a menu where the reader right-clicks or long-presses, or presses Shift+F10 or the
 * menu key on the focused element. Make the element focusable, and put the same actions
 * somewhere visible too (a menu button in the row): touch and keyboard users rarely look
 * for a context menu.
 *
 * ```html
 * <div tabindex="0" [uiContextMenu]="fileActions">invoice.pdf</div>
 * <ng-template #fileActions>
 *   <ui-menu><button ui-menu-item (triggered)="rename()">Rename</button></ui-menu>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[uiContextMenu]',
  hostDirectives: [
    {
      directive: CdkContextMenuTrigger,
      inputs: [
        'cdkContextMenuTriggerFor: uiContextMenu',
        'cdkContextMenuDisabled: uiContextMenuDisabled',
      ],
    },
  ],
})
export class ContextMenuTriggerDirective {}

/**
 * CDK menus open at the end of <body>, outside every landmark. This opens them right after
 * the trigger instead (still in the top layer), so the menu follows its button in reading
 * order and stays inside its landmark.
 */
function openInline(trigger: CdkMenuTrigger): void {
  // ponytail: patches a CDK internal, as CDK 22 has no public option for menus. If a CDK update
  // renames it, menus fall back to <body> and the a11y audit's `region` rule fails.
  const internal = trigger as unknown as {
    _getOverlayPositionStrategy?: () => FlexibleConnectedPositionStrategy;
  };
  const make = internal._getOverlayPositionStrategy?.bind(trigger);
  if (make) {
    internal._getOverlayPositionStrategy = () =>
      make().withPopoverLocation('inline');
  }
}

/** The list of a menu. Put it in the template that `uiMenuTrigger` opens. */
@Component({
  selector: 'ui-menu',
  hostDirectives: [CdkMenu],
  host: { class: 'ui-menu' },
  template: `<ng-content />`,
})
export class MenuComponent {}

/** One action in a menu. Use `(triggered)`: it fires for a click, Enter and Space. */
@Component({
  selector: 'button[ui-menu-item]',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    type: 'button',
    class: 'ui-menu__item',
    // CDK keeps a disabled item in the arrow-key order (aria-disabled), so a native
    // \`disabled\` would leave focus behind for one key press. Drop it.
    '[attr.disabled]': 'null',
    '[class.ui-menu__item--danger]': 'danger()',
  },
  template: `<ng-content />`,
})
export class MenuItemComponent {
  /** For an action that destroys something: brand red text. */
  readonly danger = input(false, { transform: booleanAttribute });
}
