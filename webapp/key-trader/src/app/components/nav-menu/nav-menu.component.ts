import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void { }

  onHomeButtonClicked(): void {
    console.log('Going to home page');
    this.router.navigate(['/']);
  }

  onProfileButtonClicked(): void {
    console.log('Going to profile page');
    this.router.navigate(['/profile-page']);
  }

  onLogoutButtonClicked(): void {
    console.log('Logging Out');
    this.authService.logout();
  }

}
