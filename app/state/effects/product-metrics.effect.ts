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
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

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
      .switchMap((productMetricsData) => this.productMetricsService.getProductMetrics(productMetricsData))
      .switchMap((productMetricsData) => this.productMetricsService.checkEmptyProductMetricsResponse(productMetricsData))
      .switchMap((productMetricsData) => this.productMetricsService.filterProductMetricsBrand(productMetricsData))
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
    let actions: Action[] = [
      new ProductMetricsActions.SetProductMetricsViewType(productMetricsData.productMetricsViewType),
      new ProductMetricsActions.FetchProductMetricsSuccess({
        positionId: productMetricsData.positionId,
        products: productMetricsData.products
      })
    ];
    if (productMetricsData.productMetricsViewType === ProductMetricsViewType.skus) {
      actions.push(new ProductMetricsActions.SelectBrandValues(productMetricsData.selectedBrandCode));
    }
    return Observable.from(actions);
  }
}
