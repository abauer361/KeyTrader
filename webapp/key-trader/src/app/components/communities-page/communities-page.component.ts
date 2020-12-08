import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communities-page',
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.css']
})
export class CommunitiesComponent implements OnInit {

  isLoading = false;
  userAuthenticated = false;
  constructor(private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
      this.isLoading = true;
      this.userAuthenticated = this.authService
      .getIsAuthenticated();
  }

  


}
