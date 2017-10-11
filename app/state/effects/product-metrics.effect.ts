import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { ProductMetricsApiService } from '../../services/product-metrics-api.service';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import { ProductMetricsDTO } from '../../models/entity-product-metrics-dto.model';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';

@Injectable()
export class ProductMetricsEffects {

  constructor(private actions$: Actions,
              private productMetricsApiService: ProductMetricsApiService,
              private productMetricsTransformerService: ProductMetricsTransformerService) {
  }

  @Effect()
  fetchProductMetrics$(): Observable<Action> {
    return this.actions$
      .ofType(ProductMetricsActions.FETCH_PRODUCT_METRICS_ACTION)
      .switchMap((action: Action) => {
        const payload: ProductMetricsActions.FetchProductMetricsPayload = action.payload;

        let dtos: Observable<ProductMetricsDTO>;
        if (action.payload.selectedEntityType === SelectedEntityType.Position) {
          dtos = this.productMetricsApiService.getPositionProductMetrics(
            payload.positionId, payload.filter, ProductMetricsAggregationType.brand
          );
        } else if (action.payload.selectedEntityType === SelectedEntityType.Account) {
          dtos = this.productMetricsApiService.getAccountProductMetrics(
            payload.positionId, payload.contextPositionId, payload.filter, ProductMetricsAggregationType.brand
          );
        } else if (action.payload.selectedEntityType === SelectedEntityType.RoleGroup) {
          dtos = this.productMetricsApiService.getRoleGroupProductMetrics(
            payload.positionId, payload.entityTypeCode, payload.filter, ProductMetricsAggregationType.brand
          );
        }

        return dtos
          .map((response: ProductMetricsDTO) => {
            return new ProductMetricsActions.FetchProductMetricsSuccessAction({
              positionId: payload.positionId,
              products: this.productMetricsTransformerService.transformProductMetrics(response, ProductMetricsAggregationType.brand)
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
