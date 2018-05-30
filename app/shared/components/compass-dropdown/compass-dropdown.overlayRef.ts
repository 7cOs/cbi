import { OverlayRef } from '@angular/cdk/overlay';

import { CompassDropdownComponent } from './compass-dropdown.component';

export class CompassDropdownOverlayRef {
  public dropdownInstance: CompassDropdownComponent;

  constructor(
    private overlayRef: OverlayRef
  ) { }

  closeDropdown(): void {
    this.overlayRef.dispose();
  }
}
