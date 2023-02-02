import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionReportRoutingModule } from './inspection-report-routing.module';
import { InspectionReportComponent } from './inspection-report.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TableGridComponent } from 'src/app/shared/components/table-grid/table-grid.component';
import { ViewDialogComponent } from 'src/app/shared/components/view-dialog/view-dialog.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    InspectionReportComponent
  ],
  imports: [
    CommonModule,
    InspectionReportRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    TableGridComponent,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    NgApexchartsModule,
    MatButtonModule,
    ViewDialogComponent,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class InspectionReportModule { }
