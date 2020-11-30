import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InnerCompComponent } from './inner-comp.component';

xdescribe('InnerCompComponent', () => {
  let component: InnerCompComponent;
  let fixture: ComponentFixture<InnerCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InnerCompComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
