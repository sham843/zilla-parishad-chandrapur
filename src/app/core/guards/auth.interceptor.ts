import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import {  exhaustMap, take } from 'rxjs';
import { WebStorageService } from '../services/web-storage.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  currentDateTime:any;
  constructor(private webStorageService: WebStorageService) {
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.webStorageService.noOfApiCall.pipe(take(1), exhaustMap(data => {
      if (data) {
        return next.handle(request);

      } else {
        let logInData = JSON.parse(this.webStorageService.getLocalStorageData())
        const authHeader = logInData.responseData.jwtAuthResult.accessToken
        const authReq = request.clone({ headers: request.headers.set('Authorization', authHeader) });
        return next.handle(authReq);
      }
    }))
  }
}
