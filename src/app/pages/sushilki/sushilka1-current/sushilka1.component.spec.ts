import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sushilka1Component } from './sushilka1.component';

describe('Sushilka1Component', () => {
  let component: Sushilka1Component;
  let fixture: ComponentFixture<Sushilka1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sushilka1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sushilka1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
