import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { ProductMetricsData } from '../../services/product-metrics.service';
import { ProductMetricsService } from '../../services/product-metrics.service';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import * as ProductMetricsViewTypeActions from '../../state/actions/product-metrics-view-type.action';

@Injectable()
export class ProductMetricsEffects {

  constructor(private actions$: Actions,
              private productMetricsService: ProductMetricsService) {
  }

  @Effect()
  fetchProductMetrics$(): Observable<Action> {
    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS)
      .switchMap((action: Action) => {
        const payload: ProductMetricsActions.FetchProductMetricsPayload = action.payload;

        const productMetricsData: ProductMetricsData = {
          positionId: payload.positionId,
          contextPositionId: payload.contextPositionId,
          entityTypeCode: payload.entityTypeCode,
          filter: payload.filter,
          selectedEntityType: payload.selectedEntityType,
          selectedBrand: payload.selectedBrand
        };

        return Observable.of(productMetricsData);
      })
      .switchMap((productMetricsData) => this.productMetricsService.getProductMetrics(productMetricsData))
      .switchMap((productMetricsData) => this.constructSuccessAction(productMetricsData))
      .catch((error: Error) => Observable.of(new ProductMetricsActions.FetchProductMetricsFailure(error)));
  }

  @Effect({dispatch: false})
  fetchProdcutMetricsFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE)
      .do((action: Action) => {
        console.error('ProductMetrics fetch failure:', action.payload);
      });
  }

  private constructSuccessAction(productMetricsData: ProductMetricsData): Observable<Action> {
    return Observable.from([
      new ProductMetricsViewTypeActions.SetProductMetricsViewType(productMetricsData.productMetricsViewType),
      new ProductMetricsActions.FetchProductMetricsSuccess({
        positionId: productMetricsData.positionId,
        products: productMetricsData.products
      })
    ]);
  }
}
