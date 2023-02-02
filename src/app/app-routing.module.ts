import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CheckLoggedInGuard } from './core/guards/check-logged-in.guard';
import { PublicComponent } from './layouts/public/public.component';
import { SecureComponent } from './layouts/secure/secure.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: PublicComponent,
  canActivate: [CheckLoggedInGuard],
  loadChildren: () => import('./layouts/public/public.module').then(m => m.PublicModule) },
  {
    path: '',
    canActivate: [AuthGuard],
    component: SecureComponent,
    loadChildren: () => import('./layouts/secure/secure.module').then(m => m.SecureModule) 
  },
  
  
  { path: '**', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule)}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
