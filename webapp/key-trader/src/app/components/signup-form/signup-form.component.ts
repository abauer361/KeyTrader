import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) { }

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

    if (this.password != this.confirm) {
      console.log("Passwords do not match.")
    }
    else {
      console.log(form.value);
      //this.userService.fetchUser();
    }
  }


}
