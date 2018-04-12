import { NgModule } from '@angular/core';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ListDetailComponent
  ],
  providers: [
    ListsApiService,
    ListsTransformerService
  ],
  imports: [
    SharedModule
  ]
})

export class ListDetailModule {}
