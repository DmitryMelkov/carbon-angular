import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillSBM3Component } from './mill-sbm3.component';

describe('MillSBM3Component', () => {
  let component: MillSBM3Component;
  let fixture: ComponentFixture<MillSBM3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillSBM3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillSBM3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
