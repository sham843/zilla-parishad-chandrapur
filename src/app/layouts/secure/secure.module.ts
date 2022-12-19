import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { SidebarComponent } from 'src/app/core/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/core/header/header.component';
import { FooterComponent } from 'src/app/core/footer/footer.component';

@NgModule({
  declarations: [
    SecureComponent
  ],
  imports: [
    CommonModule,
    SecureRoutingModule,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class SecureModule { }
