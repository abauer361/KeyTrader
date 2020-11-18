import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let debugElement: DebugElement;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavMenuComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display 'Home'`, () => {
    // Assert the text on screen says "Home"
    const btn = fixture.debugElement.nativeElement.querySelector('#home');
    expect(btn.innerHTML).toEqual('Home');
  });

  it(`should display 'Profile'`, () => {
    // Assert the text on screen says "Profile"
    const btn = fixture.debugElement.nativeElement.querySelector('#profile');
    expect(btn.innerHTML).toEqual('Profile');
  });

  it(`should display 'Logout'`, () => {
    // Assert the text on screen says "Logout"
    const btn = fixture.debugElement.nativeElement.querySelector('#logout');
    expect(btn.innerHTML).toEqual('Logout');
  });

  it(`should navigate to homepage`, () => {
    // Assert the router should navigate to Home
    const navigateSpy = spyOn(router, 'navigate');
    const btn = fixture.debugElement.nativeElement.querySelector('#home');
    btn.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it(`should navigate to profile page`, () => {
    // Assert the router should navigate to Home
    const navigateSpy = spyOn(router, 'navigate');
    const btn = fixture.debugElement.nativeElement.querySelector('#profile');
    btn.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/profile-page']);
  });

  it(`should logout`, () => {
    // Assert the router should navigate to Home
    const navigateSpy = spyOn(router, 'navigate');
    const btn = fixture.debugElement.nativeElement.querySelector('#logout');
    btn.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
