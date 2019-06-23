import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetsPage } from './vets.page';

describe('Tab2Page', () => {
  let component: VetsPage;
  let fixture: ComponentFixture<VetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VetsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
