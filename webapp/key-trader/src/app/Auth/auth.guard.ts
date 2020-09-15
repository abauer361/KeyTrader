import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth && this.cookieService.get('jwt') === '') {

      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
