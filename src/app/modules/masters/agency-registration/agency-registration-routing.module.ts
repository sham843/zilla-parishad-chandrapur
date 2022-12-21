import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyRegistrationComponent } from './agency-registration.component';

const routes: Routes = [{ path: '', component: AgencyRegistrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRegistrationRoutingModule { }
