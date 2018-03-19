import { OriginConnectionPosition, OverlayConnectionPosition } from '@angular/cdk/overlay';

export interface CompassOverlayPositionConfig {
  originConnectionPosition: OriginConnectionPosition;
  overlayConnectionPosition: OverlayConnectionPosition;
  overlayOffsetX: number;
  overlayOffsetY: number;
}
