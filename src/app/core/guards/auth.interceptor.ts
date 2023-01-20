import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
} from '@angular/common/http';
import { WebStorageService } from '../services/web-storage.service';
import {  NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MasterService } from '../services/master.service';
import { CommonMethodsService } from '../services/common-methods.service';
import { Observable } from 'rxjs';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  currentDateTime: any;


  constructor(private webStorageService: WebStorageService, private router: Router, private masterService: MasterService,
    private commonMethods: CommonMethodsService) {
    if (this.webStorageService.checkUserIsLoggedIn()) {
      this.router.events.subscribe((event: any) => {
        if (event instanceof (NavigationEnd || NavigationStart)) {
          this.masterService.getServerDateTime().subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.currentDateTime = (Math.round(new Date(res.responseData).getTime() / 1000));
              let localStorageData = JSON.parse(this.webStorageService.getLocalStorageData());
              let expireAccessToken: any = (Math.round(new Date(localStorageData?.responseData?.jwtAuthResult?.expireAccessToken).getTime() / 1000));
              let tokenExpireDateTime: any = (Math.round(new Date(localStorageData?.responseData?.jwtAuthResult?.refreshToken.expireAt).getTime() / 1000));
              if (this.currentDateTime >= expireAccessToken) {
                if (this.currentDateTime <= tokenExpireDateTime) {
                  let obj = {
                    refreshTokenString: this.webStorageService.getLoginData()?.jwtAuthResult?.refreshToken?.tokenString,
                    accessTokenString: this.webStorageService.getLoginData()?.jwtAuthResult.accessToken,
                    userId: this.webStorageService.getId()
                  }
                  this.masterService.refreshTokenJWT(obj);
                } else {
                  localStorage.removeItem('loggedInData');
                  this.router.navigate(['/login']);
                  this.commonMethods.snackBar('Your Session Has Expired. Please Re-Login Again.', 1);
                }
              }
            }
          })
        }
      });
    }
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.webStorageService.checkUserIsLoggedIn()) {
      return next.handle(request);
    } else {
      let logInData = JSON.parse(this.webStorageService.getLocalStorageData())
      const authHeader = logInData.responseData.jwtAuthResult.accessToken
      const authReq = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + authHeader) });
      return next.handle(authReq)
    }
  }
}
