import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { FetchProductMetricsPayload } from '../../state/actions/product-metrics.action';
import { ProductMetricsData } from '../../services/product-metrics.service';
import { ProductMetricsService } from '../../services/product-metrics.service';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';

@Injectable()
export class ProductMetricsEffects {

  constructor(private actions$: Actions,
              private productMetricsService: ProductMetricsService) {
  }

  @Effect()
  fetchProductMetrics$(): Observable<Action> {
    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS)
      .switchMap((action: Action): Observable<FetchProductMetricsPayload> => Observable.of(action.payload))
      .switchMap((productMetricsData: ProductMetricsData) => this.productMetricsService.getProductMetrics(productMetricsData))
      .switchMap((productMetricsData: ProductMetricsData) => {
        return this.productMetricsService.checkEmptyProductMetricsResponse(productMetricsData);
      })
      .switchMap((productMetricsData: ProductMetricsData) => this.productMetricsService.filterProductMetricsBrand(productMetricsData))
      .switchMap((productMetricsData: ProductMetricsData) => this.constructSuccessAction(productMetricsData))
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
      new ProductMetricsActions.SetProductMetricsViewType(productMetricsData.productMetricsViewType),
      new ProductMetricsActions.FetchProductMetricsSuccess({
        positionId: productMetricsData.positionId,
        products: productMetricsData.products
      })
    ]);
  }
}
