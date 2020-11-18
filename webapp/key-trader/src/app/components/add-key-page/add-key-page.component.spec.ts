import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddKeyPageComponent } from './add-key-page.component';

xdescribe('AddKeyPageComponent', () => {
  let component: AddKeyPageComponent;
  let fixture: ComponentFixture<AddKeyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddKeyPageComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKeyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
