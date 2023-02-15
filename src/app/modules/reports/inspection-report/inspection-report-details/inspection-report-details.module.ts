import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionReportDetailsRoutingModule } from './inspection-report-details-routing.module';
import { InspectionReportDetailsComponent } from './inspection-report-details.component';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    InspectionReportDetailsComponent
  ],
  imports: [
    CommonModule,
    InspectionReportDetailsRoutingModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule,
    TranslateModule,
  ]
})
export class InspectionReportDetailsModule { }
