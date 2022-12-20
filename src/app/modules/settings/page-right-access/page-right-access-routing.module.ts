import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRightAccessComponent } from './page-right-access.component';

const routes: Routes = [{ path: '', component: PageRightAccessComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRightAccessRoutingModule { }
