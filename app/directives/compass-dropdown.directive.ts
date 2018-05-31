import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { CompassDropdownData } from '../models/compass-dropdown-data.model';
import { CompassDropdownOverlayRef } from '../shared/components/compass-dropdown/compass-dropdown.overlayRef';
import { CompassDropdownService } from '../services/compass-dropdown.service';
import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../models/compass-overlay-position-config.model';

export const COMPASS_DROPDOWN_POSITION_CONFIG: CompassOverlayPositionConfig = {
  originConnectionPosition: { originX: 'center', originY: 'bottom' },
  overlayConnectionPosition: { overlayX: 'center', overlayY: 'top' },
  overlayOffsetX: 0,
  overlayOffsetY: 0
};
export const COMPASS_DROPDOWN_OVERLAY_CONFIG: CompassOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'compass-dropdown-backdrop'
};

@Directive({
  selector: '[compassDropdown]'
})
export class CompassDropdownDirective implements OnDestroy {
  @Output() onCompassDropdownClicked = new EventEmitter<string>();

  @Input('compassDropdownData') compassDropdownData: CompassDropdownData;
  @Input('compassDropdownDisabled') compassDropdownDisabled: boolean = false;

  private ngUnsubscribe: Subject<Event> = new Subject();
  private dropdownOverlayRef: CompassDropdownOverlayRef;

  constructor(
    private compassDropdownService: CompassDropdownService,
    private elementRef: ElementRef
  ) { }

  @HostListener('click') onHostElementClicked(): void {
    if (!this.compassDropdownDisabled) this.openCompassDropdown();
  }

  ngOnDestroy() {
    this.closeCompassDropdown();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private openCompassDropdown(): void {
    this.dropdownOverlayRef = this.compassDropdownService.showDropdown(
      this.elementRef,
      this.compassDropdownData,
      COMPASS_DROPDOWN_POSITION_CONFIG,
      COMPASS_DROPDOWN_OVERLAY_CONFIG
    );

    this.dropdownOverlayRef.dropdownInstance.onCompassDropdownClicked
      .takeUntil(this.ngUnsubscribe)
      .subscribe((itemSelected: string) => {
        this.onCompassDropdownClicked.emit(itemSelected);
        this.closeCompassDropdown();
      });
  }

  private closeCompassDropdown(): void {
    if (this.dropdownOverlayRef) this.dropdownOverlayRef.closeDropdown();
  }
}
