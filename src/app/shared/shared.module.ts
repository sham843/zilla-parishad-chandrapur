import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';
import { TableComponent } from './components/table/table.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import { PageStatisticsComponent } from './components/page-statistics/page-statistics.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    DashPipe,
    TableComponent,
    PageStatisticsComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [TableComponent, PageStatisticsComponent]
})
export class SharedModule { }
