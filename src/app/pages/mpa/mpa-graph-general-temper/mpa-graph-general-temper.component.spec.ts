import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpaGraphGeneralTemperComponent } from './mpa-graph-general-temper.component';

describe('MpaGraphGeneralTemperComponent', () => {
  let component: MpaGraphGeneralTemperComponent;
  let fixture: ComponentFixture<MpaGraphGeneralTemperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpaGraphGeneralTemperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpaGraphGeneralTemperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
