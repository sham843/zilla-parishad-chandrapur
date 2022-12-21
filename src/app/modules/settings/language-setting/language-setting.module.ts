import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageSettingRoutingModule } from './language-setting-routing.module';
import { LanguageSettingComponent } from './language-setting.component';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    LanguageSettingComponent
  ],
  imports: [
    CommonModule,
    LanguageSettingRoutingModule,
    MatCardModule
  ]
})
export class LanguageSettingModule { }
