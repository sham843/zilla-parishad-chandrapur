import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageSettingRoutingModule } from './language-setting-routing.module';
import { LanguageSettingComponent } from './language-setting.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    LanguageSettingComponent
  ],
  imports: [
    CommonModule,
    LanguageSettingRoutingModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class LanguageSettingModule { }
