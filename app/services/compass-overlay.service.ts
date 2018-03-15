import { ElementRef, Injectable, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { PortalInjector } from '@angular/cdk/portal';

import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../models/compass-overlay-position-config.model';

@Injectable()
export class CompassOverlayService {

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  public getCenteredOverlayPortalHost(compassOverlayConfig: CompassOverlayConfig): OverlayRef {
    const overlayConfig: OverlayConfig = this.getCenteredOverlayConfig(compassOverlayConfig);
    return this.overlay.create(overlayConfig);
  }

  public getConnectedToOverlayPortalHost(
    hostElementRef: ElementRef,
    compassPositionConfig: CompassOverlayPositionConfig,
    compassOverlayConfig: CompassOverlayConfig
  ): OverlayRef {
    const overlayConfig: OverlayConfig = this.getConnectedToOverlayConfig(hostElementRef, compassPositionConfig, compassOverlayConfig);
    return this.overlay.create(overlayConfig);
  }

  public getInputPortalInjector(injectionToken: InjectionToken<any>, inputObject: any): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(injectionToken, inputObject);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getCenteredOverlayConfig(compassOverlayConfig: CompassOverlayConfig): OverlayConfig {
    const positionStrategy: PositionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig(Object.assign({}, compassOverlayConfig, {
      positionStrategy: positionStrategy
    }));
  }

  private getConnectedToOverlayConfig(
    hostElementRef: ElementRef,
    positionConfig: CompassOverlayPositionConfig,
    overlayConfig: CompassOverlayConfig
  ): OverlayConfig {
    const positionStrategy: PositionStrategy = this.overlay
      .position()
      .connectedTo(hostElementRef, positionConfig.originConnectionPosition, positionConfig.overlayConnectionPosition)
      .withOffsetX(positionConfig.overlayOffsetX)
      .withOffsetY(positionConfig.overlayOffsetY);

    return new OverlayConfig(Object.assign({}, overlayConfig, {
      positionStrategy: positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    }));
  }
}
