import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessDeniedComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display 'You do not have access to this page'`, () => {
    // Assert the text on screen says "You do not have access to this page"
    debugElement = fixture.debugElement.query(By.css('h1'));
    htmlElement = debugElement.nativeElement;
    expect(htmlElement.textContent).toEqual(
      'You do not have access to this page'
    );
  });

  it(`should display 'If you believe this is incorrect, please contact the owner of your discord.'`, () => {
    // Assert the text on screen says "If you believe this is incorrect, please contact the owner of your discord."
    debugElement = fixture.debugElement.query(By.css('h3'));
    htmlElement = debugElement.nativeElement;
    expect(htmlElement.textContent).toEqual(
      'If you believe this is incorrect, please contact the owner of your discord.'
    );
  });

  it(`should display 'Return Home'`, () => {
    // Assert the text on screen says "Return Home"
    debugElement = fixture.debugElement.query(By.css('button'));
    htmlElement = debugElement.nativeElement;
    expect(htmlElement.textContent).toEqual('Return Home');
  });
});
