import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeRolesComponent } from './change-roles.component';

xdescribe('ChangeRolesComponent', () => {
  let component: ChangeRolesComponent;
  let fixture: ComponentFixture<ChangeRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeRolesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
