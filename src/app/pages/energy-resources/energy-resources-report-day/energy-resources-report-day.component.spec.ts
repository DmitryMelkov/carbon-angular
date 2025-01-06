import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyResourcesReportDayComponent } from './energy-resources-report-day.component';

describe('EnergyResourcesReportDayComponent', () => {
  let component: EnergyResourcesReportDayComponent;
  let fixture: ComponentFixture<EnergyResourcesReportDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyResourcesReportDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyResourcesReportDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
