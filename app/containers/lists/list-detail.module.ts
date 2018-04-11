import { NgModule } from '@angular/core';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsTransformerService } from '../../services/lists-transformer.service';

@NgModule({
  declarations: [
    ListDetailComponent
  ],
  providers: [
    ListsApiService,
    ListsTransformerService
  ]
})

export class ListDetailModule {}
