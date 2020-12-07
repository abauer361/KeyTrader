import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communities-page',
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.css']
})
export class CommunitiesComponent  {

  constructor(private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
      
  }


}
