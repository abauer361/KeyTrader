import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServersPageComponent } from './servers-page.component';

xdescribe('ServersPageComponent', () => {
  let component: ServersPageComponent;
  let fixture: ComponentFixture<ServersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServersPageComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
