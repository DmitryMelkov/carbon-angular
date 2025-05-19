import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressChartPressureGeneralComponent } from './press-chart-pressure-general.component';

describe('PressChartPressureGeneralComponent', () => {
  let component: PressChartPressureGeneralComponent;
  let fixture: ComponentFixture<PressChartPressureGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressChartPressureGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressChartPressureGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
