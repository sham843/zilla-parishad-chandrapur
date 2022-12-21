import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageSettingRoutingModule } from './language-setting-routing.module';
import { LanguageSettingComponent } from './language-setting.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    LanguageSettingComponent
  ],
  imports: [
    CommonModule,
    LanguageSettingRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class LanguageSettingModule { }
