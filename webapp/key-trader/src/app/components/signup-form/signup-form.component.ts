import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service' ;
import {NgForm} from '@angular/forms';
import { AuthData } from '../../Models/auth-data.model';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
  providers: [AuthService]
})
export class SignupFormComponent implements OnInit {

  constructor( private router: Router,
    private userService: AuthService) { }

  password: String;
  confirm: String;

  ngOnInit(): void {
  }

  onSubmitButtonClicked(): void {
    console.log('Going to key-trader home page');
    this.router.navigate(['/']);
  }

  onSignup(form: NgForm) {
    this.password = form.value.passwordInput;
    this.confirm= form.value.confirmInput;

    if (form.invalid) {
      console.log("Invalid form.")
    }
    else if (this.password != this.confirm) {
      console.log("Passwords do not match.")
    }
    else {
      console.log(form.value);
      this.userService.createUser(form.value.email, form.value.password);
    }
  }


}
