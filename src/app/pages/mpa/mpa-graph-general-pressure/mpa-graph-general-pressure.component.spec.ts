import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpaGraphGeneralPressureComponent } from './mpa-graph-general-pressure.component';

describe('MpaGraphGeneralPressureComponent', () => {
  let component: MpaGraphGeneralPressureComponent;
  let fixture: ComponentFixture<MpaGraphGeneralPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpaGraphGeneralPressureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpaGraphGeneralPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
