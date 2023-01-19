import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WebStorageService } from '../services/web-storage.service';
@Injectable({
  providedIn: 'root'

})
export class ExpenseGuard implements CanActivate {
  constructor(private router: Router, private WebStorageService: WebStorageService) { }

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any {
    let urlSplit: any = route.routeConfig?.path?.split('/');
    if (this.WebStorageService?.getAllPageName()?.find((x: any) => x.pageURL.includes(urlSplit[0]))) {
      return true;
    }
    else {
      this.router.navigate(['/access-denied']);
      return false
    }
  }
}
