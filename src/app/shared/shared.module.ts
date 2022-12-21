import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { PageStatisticsComponent } from './components/page-statistics/page-statistics.component';
import { MatIconModule } from '@angular/material/icon';
import { TableGridComponent } from './components/table-grid/table-grid.component';

@NgModule({
  declarations: [
    DashPipe,
    TableGridComponent,
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
  // exports: [TableGridComponent, PageStatisticsComponent]
})
export class SharedModule { }
