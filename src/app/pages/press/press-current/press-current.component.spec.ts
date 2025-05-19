import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressCurrentComponent } from './press-current.component';

describe('PressCurrentComponent', () => {
  let component: PressCurrentComponent;
  let fixture: ComponentFixture<PressCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressCurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
