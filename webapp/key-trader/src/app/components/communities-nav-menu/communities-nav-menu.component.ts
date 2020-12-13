import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-communities-nav-menu',
  templateUrl: './communities-nav-menu.component.html',
  styleUrls: ['./communities-nav-menu.component.css']
})
export class CommunitiesNavMenuComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void { }

  onHomeButtonClicked(): void {
    console.log('Going to home page');
    this.router.navigate(['/communities-page']);
  }

  onLogoutButtonClicked(): void {
    console.log('Logging Out');
    this.authService.logoutKeyTraderUser();
  }

}
