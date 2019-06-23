import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPage } from './customer.page';

describe('Tab2Page', () => {
  let component: CustomerPage;
  let fixture: ComponentFixture<CustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
