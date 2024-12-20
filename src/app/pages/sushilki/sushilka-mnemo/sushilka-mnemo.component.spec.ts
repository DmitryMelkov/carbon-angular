import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaMnemo1Component } from './sushilka-mnemo-1.component';

describe('SushilkaMnemoComponent', () => {
  let component: SushilkaMnemo1Component;
  let fixture: ComponentFixture<SushilkaMnemo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaMnemo1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SushilkaMnemo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
