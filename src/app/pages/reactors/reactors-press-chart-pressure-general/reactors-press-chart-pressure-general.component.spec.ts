import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactorsPressChartPressureGeneralComponent } from './reactors-press-chart-pressure-general.component';

describe('ReactorsPressChartPressureGeneralComponent', () => {
  let component: ReactorsPressChartPressureGeneralComponent;
  let fixture: ComponentFixture<ReactorsPressChartPressureGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactorsPressChartPressureGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactorsPressChartPressureGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
