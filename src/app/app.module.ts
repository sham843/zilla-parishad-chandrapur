import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from './core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from './core/services/api.service';
import { AuthInterceptor } from './core/guards/auth.interceptor';

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule ,
    MatPaginatorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
    
  ],
  exports:[],
  providers: [ ApiService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true // option. This is required and tells Angular that HTTP_INTERCEPTORS is an array of values, rather than a single value.
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
