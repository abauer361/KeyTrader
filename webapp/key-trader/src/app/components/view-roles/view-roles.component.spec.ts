import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewRolesComponent } from './view-roles.component';

xdescribe('ViewRolesComponent', () => {
  let component: ViewRolesComponent;
  let fixture: ComponentFixture<ViewRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRolesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
