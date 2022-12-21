import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceIndicatorsComponent } from './performance-indicators.component';

const routes: Routes = [{ path: '', component: PerformanceIndicatorsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceIndicatorsRoutingModule { }
