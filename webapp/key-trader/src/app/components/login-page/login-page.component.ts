import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent  {

  constructor(private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
  }

  onLoginButtonClicked(): void {
    console.log('Going to key trader login form');
    this.router.navigate(['/login-form']);
  }

}
