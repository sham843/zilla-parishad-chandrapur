import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRightAccessRoutingModule } from './page-right-access-routing.module';
import { PageRightAccessComponent } from './page-right-access.component';


@NgModule({
  declarations: [
    PageRightAccessComponent
  ],
  imports: [
    CommonModule,
    PageRightAccessRoutingModule
  ]
})
export class PageRightAccessModule { }
