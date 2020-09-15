import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeKeysPageComponent } from './see-keys-page.component';

describe('SeeKeysPageComponent', () => {
  let component: SeeKeysPageComponent;
  let fixture: ComponentFixture<SeeKeysPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeKeysPageComponent ]
    })
    .compileComponents();
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
