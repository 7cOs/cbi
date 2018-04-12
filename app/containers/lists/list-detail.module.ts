import { NgModule } from '@angular/core';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ListDetailComponent
  ]
})

export class ListDetailModule {}
