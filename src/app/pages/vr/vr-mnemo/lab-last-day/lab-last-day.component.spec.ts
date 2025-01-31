import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabLastDayComponent } from './lab-last-day.component';

describe('LabLastDayComponent', () => {
  let component: LabLastDayComponent;
  let fixture: ComponentFixture<LabLastDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabLastDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabLastDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
