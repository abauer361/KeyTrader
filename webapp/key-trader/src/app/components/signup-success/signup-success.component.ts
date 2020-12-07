import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {

  constructor(
              private authService: AuthService) { }

  ngOnInit(): void {
  }



}
