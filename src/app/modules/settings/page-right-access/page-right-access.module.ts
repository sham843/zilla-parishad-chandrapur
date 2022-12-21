import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRightAccessRoutingModule } from './page-right-access-routing.module';
import { PageRightAccessComponent } from './page-right-access.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageRightAccessComponent
  ],
  imports: [
    CommonModule,
    PageRightAccessRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    TableGridComponent,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class PageRightAccessModule { }
