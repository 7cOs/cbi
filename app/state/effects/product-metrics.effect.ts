import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import { ProductMetricsDTO } from '../../models/entity-product-metrics-dto.model';
import { ProductMetricType } from '../../enums/product-metrics-type.enum';

@Injectable()
export class ProductMetricsEffects {

  constructor(private actions$: Actions,
              private myPerformanceApiService: MyPerformanceApiService,
              private productMetricsTransformerService: ProductMetricsTransformerService) {
  }

  @Effect()
  fetchProductMetrics$(): Observable<Action> {
    let filter: MyPerformanceFilterState;
    let positionId: string;

    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS_ACTION)
      .switchMap((action: Action) => {
        positionId = action.payload.positionId;
        filter = action.payload.filter;

        return this.myPerformanceApiService.getProductMetrics(positionId, filter, ProductMetricType.brand)
          .map((response: ProductMetricsDTO) => {
            return new ProductMetricsActions.FetchProductMetricsSuccessAction({
              positionId: positionId,
              products: this.productMetricsTransformerService.transformProductMetrics(response, ProductMetricType.brand)
            });
          })
          .catch((err: Error) => Observable.of(new ProductMetricsActions.FetchProductMetricsFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchProdcutMetricsFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE_ACTION)
      .do((action: Action) => {
        console.error('ProductMetrics fetch failure:', action.payload);
      });
  }
}
