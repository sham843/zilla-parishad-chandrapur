import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRightAccessRoutingModule } from './page-right-access-routing.module';
import { PageRightAccessComponent } from './page-right-access.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    PageRightAccessComponent
  ],
  imports: [
    CommonModule,
    PageRightAccessRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class PageRightAccessModule { }
