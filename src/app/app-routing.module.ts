import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }] } },
  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] } },
  { path: '**', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
