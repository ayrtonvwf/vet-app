import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetPage } from './vet.page';

describe('Tab2Page', () => {
  let component: VetPage;
  let fixture: ComponentFixture<VetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VetPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
