import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKeyPageComponent } from './add-key-page.component';

describe('AddKeyPageComponent', () => {
  let component: AddKeyPageComponent;
  let fixture: ComponentFixture<AddKeyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKeyPageComponent ]
    })
    .compileComponents();
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
