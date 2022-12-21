import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageSettingRoutingModule } from './language-setting-routing.module';
import { LanguageSettingComponent } from './language-setting.component';


@NgModule({
  declarations: [
    LanguageSettingComponent
  ],
  imports: [
    CommonModule,
    LanguageSettingRoutingModule
  ]
})
export class LanguageSettingModule { }
