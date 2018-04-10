import { NgModule } from '@angular/core';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsHeaderComponent } from '../../shared/components/lists-header/lists-header.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ListDetailComponent,
    ListsHeaderComponent,
  ]
})

export class ListDetailModule {}
