import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyResourcesCurrentComponent } from './energy-resources-current.component';

describe('EnergyResourcesCurrentComponent', () => {
  let component: EnergyResourcesCurrentComponent;
  let fixture: ComponentFixture<EnergyResourcesCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyResourcesCurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyResourcesCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
