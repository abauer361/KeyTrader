import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerCompComponent } from './inner-comp.component';

describe('InnerCompComponent', () => {
  let component: InnerCompComponent;
  let fixture: ComponentFixture<InnerCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerCompComponent ]
    })
    .compileComponents();
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
