import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SeeKeysPageComponent } from './see-keys-page.component';

xdescribe('SeeKeysPageComponent', () => {
  let component: SeeKeysPageComponent;
  let fixture: ComponentFixture<SeeKeysPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeeKeysPageComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeKeysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
