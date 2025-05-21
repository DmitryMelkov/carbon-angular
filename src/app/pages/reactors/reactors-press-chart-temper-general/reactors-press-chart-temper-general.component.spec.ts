import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactorsPressChartTemperGeneralComponent } from './reactors-press-chart-temper-general.component';

describe('ReactorsPressChartTemperGeneralComponent', () => {
  let component: ReactorsPressChartTemperGeneralComponent;
  let fixture: ComponentFixture<ReactorsPressChartTemperGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactorsPressChartTemperGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactorsPressChartTemperGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
