import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    this.authService.loginKeyTraderUser(form.value.emailInput, form.value.userInput, form.value.passwordInput);
  }


}
