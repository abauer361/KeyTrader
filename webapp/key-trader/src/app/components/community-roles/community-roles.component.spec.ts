import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityRolesComponent } from './community-roles.component';

xdescribe('CommunityRolesComponent', () => {
  let component: CommunityRolesComponent;
  let fixture: ComponentFixture<CommunityRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityRolesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
