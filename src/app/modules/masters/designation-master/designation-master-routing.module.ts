import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignationMasterComponent } from './designation-master.component';

const routes: Routes = [{ path: '', component: DesignationMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationMasterRoutingModule { }
