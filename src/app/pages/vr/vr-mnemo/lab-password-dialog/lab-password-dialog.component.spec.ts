import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPasswordDialogComponent } from './lab-password-dialog.component';

describe('LabPasswordDialogComponent', () => {
  let component: LabPasswordDialogComponent;
  let fixture: ComponentFixture<LabPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabPasswordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
