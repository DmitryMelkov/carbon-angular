import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCurrentComponent } from './lab-current.component';

describe('LabCurrentComponent', () => {
  let component: LabCurrentComponent;
  let fixture: ComponentFixture<LabCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabCurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
