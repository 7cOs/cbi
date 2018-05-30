import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassDropdownComponent, COMPASS_DROPDOWN_DATA } from '../shared/components/compass-dropdown/compass-dropdown.component';
import { CompassDropdownData } from '../models/compass-dropdown-data.model';
import { CompassDropdownOverlayRef } from '../shared/components/compass-dropdown/compass-dropdown.overlayRef';
import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../models/compass-overlay-position-config.model';
import { CompassOverlayService } from './compass-overlay.service';

@Injectable()
export class CompassDropdownService {

  constructor(
    private compassOverlayService: CompassOverlayService
  ) { }

  public showDropdown(
    dropdownElementRef: ElementRef,
    dropdownInput: CompassDropdownData,
    compassPositionConfig: CompassOverlayPositionConfig,
    compassOverlayConfig: CompassOverlayConfig
  ): CompassDropdownOverlayRef {
    const overlayPortalHost: OverlayRef = this.compassOverlayService.getConnectedToOverlayPortalHost(
      dropdownElementRef,
      compassPositionConfig,
      compassOverlayConfig
    );
    const dropdownInputPortalInjector: PortalInjector = this.compassOverlayService.getInputPortalInjector(
      COMPASS_DROPDOWN_DATA,
      dropdownInput
    );
    const overlayDropdownComponent: CompassDropdownComponent = this.attachDropdown(overlayPortalHost, dropdownInputPortalInjector);
    const dropdownOverlayRef: CompassDropdownOverlayRef = new CompassDropdownOverlayRef(overlayPortalHost);

    overlayPortalHost.backdropClick().subscribe(() => dropdownOverlayRef.closeDropdown());
    dropdownOverlayRef.dropdownInstance = overlayDropdownComponent;

    return dropdownOverlayRef;
  }

  private attachDropdown(portalHost: OverlayRef, dropdownInput: PortalInjector): CompassDropdownComponent {
    const dropdownPortal: ComponentPortal<CompassDropdownComponent> = new ComponentPortal(
      CompassDropdownComponent,
      null,
      dropdownInput
    );
    const dropdownRef: ComponentRef<CompassDropdownComponent> = portalHost.attach(dropdownPortal);

    return dropdownRef.instance;
  }
}
