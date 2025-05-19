import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressChartTemperGeneralComponent } from './press-chart-temper-general.component';

describe('PressChartTemperGeneralComponent', () => {
  let component: PressChartTemperGeneralComponent;
  let fixture: ComponentFixture<PressChartTemperGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressChartTemperGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressChartTemperGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
