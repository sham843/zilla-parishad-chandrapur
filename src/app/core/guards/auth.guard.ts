import { Injectable } from '@angular/core';
import { CanActivate, Router,  UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WebStorageService } from '../services/web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private WebStorageService: WebStorageService, private router: Router){}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.WebStorageService.checkUserIsLoggedIn()) {
        this.router.navigate(['/login']);
        return false
      } else {
        return true;
      }
  }
}
