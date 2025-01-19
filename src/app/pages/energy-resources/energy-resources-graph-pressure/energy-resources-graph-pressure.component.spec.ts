import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyResourcesGraphPressureComponent } from './energy-resources-graph-pressure.component';

describe('EnergyResourcesGraphPressureComponent', () => {
  let component: EnergyResourcesGraphPressureComponent;
  let fixture: ComponentFixture<EnergyResourcesGraphPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyResourcesGraphPressureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyResourcesGraphPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
