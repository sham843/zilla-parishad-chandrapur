import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    MatIconModule
  ]
})
export class ErrorModule { }
