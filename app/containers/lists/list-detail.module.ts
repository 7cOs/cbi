import { NgModule } from '@angular/core';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsHeaderComponent } from '../../shared/components/lists-header/lists-header.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ListsTransformerService } from '../../services/lists-transformer.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ListDetailComponent,
    ListsHeaderComponent,
    ListDetailComponent
  ],
  providers: [
    ListsApiService,
    ListsTransformerService
  ]
})

export class ListDetailModule {}
