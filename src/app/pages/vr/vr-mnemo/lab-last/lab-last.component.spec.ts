import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabLastComponent } from './lab-last.component';

describe('LabLastComponent', () => {
  let component: LabLastComponent;
  let fixture: ComponentFixture<LabLastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabLastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
