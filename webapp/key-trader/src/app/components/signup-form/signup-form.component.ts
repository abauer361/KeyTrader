import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service' ;
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
  providers: [AuthService]
})
export class SignupFormComponent implements OnInit {

  constructor( private router: Router,
    private authService: AuthService) { }

  password: String;
  confirm: String;

  ngOnInit(): void {
  }

  

  onSignup(form: NgForm) {
    this.password = form.value.passwordInput;
    this.confirm= form.value.confirmInput;

    if (form.invalid) {
      console.log("Invalid form.")
    }
    else if (this.password != this.confirm) {
      //needs UI output
      console.log("Passwords do not match.")
    }
    else {
      this.authService.createKeyTraderUser(form.value.emailInput, form.value.userInput, form.value.passwordInput);
    }
  }


}
