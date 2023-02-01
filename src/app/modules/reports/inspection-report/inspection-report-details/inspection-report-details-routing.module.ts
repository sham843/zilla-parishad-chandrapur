import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionReportDetailsComponent } from './inspection-report-details.component';

const routes: Routes = [{ path: '', component: InspectionReportDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionReportDetailsRoutingModule { }
