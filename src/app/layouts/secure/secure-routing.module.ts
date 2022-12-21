import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';

const routes: Routes = [
  { path: '', component: SecureComponent },
  { path: 'dashboard', loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] } },
  { path: 'designation-master', loadChildren: () => import('../../modules/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), data: { breadcrumb: [{ title: 'Designation Master', active: true }] } },
  { path: 'school-registration', loadChildren: () => import('../../modules/masters/school-registration/school-registration.module').then(m => m.SchoolRegistrationModule), data: { breadcrumb: [{ title: 'School Registration', active: true }] }  },
  { path: 'student-registration', loadChildren: () => import('../../modules/masters/student-registration/student-registration.module').then(m => m.StudentRegistrationModule), data: { breadcrumb: [{ title: 'Student Registration', active: true }] }  },
  { path: 'user-registration', loadChildren: () => import('../../modules/masters/user-registration/user-registration.module').then(m => m.UserRegistrationModule), data: { breadcrumb: [{ title: 'User Registration', active: true }] }  },
  { path: 'page-right-access', loadChildren: () => import('../../modules/settings/page-right-access/page-right-access.module').then(m => m.PageRightAccessModule), data: { breadcrumb: [{ title: 'Page Right Access', active: true }] }  },
  { path: 'agency-registration', loadChildren: () => import('../../modules/masters/agency-registration/agency-registration.module').then(m => m.AgencyRegistrationModule) },
  { path: 'language-setting', loadChildren: () => import('../../modules/settings/language-setting/language-setting.module').then(m => m.LanguageSettingModule) },
  { path: 'performance-indicators', loadChildren: () => import('../../modules/settings/performance-indicators/performance-indicators.module').then(m => m.PerformanceIndicatorsModule) },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
