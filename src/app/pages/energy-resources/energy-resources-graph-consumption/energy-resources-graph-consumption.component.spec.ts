import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyResourcesGraphConsumptionComponent } from './energy-resources-graph-consumption.component';

describe('EnergyResourcesGraphConsumptionComponent', () => {
  let component: EnergyResourcesGraphConsumptionComponent;
  let fixture: ComponentFixture<EnergyResourcesGraphConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyResourcesGraphConsumptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyResourcesGraphConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
