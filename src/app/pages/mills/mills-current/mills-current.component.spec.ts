import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillsCurrentComponent } from './mills-current.component';

describe('MillsCurrentComponent', () => {
  let component: MillsCurrentComponent;
  let fixture: ComponentFixture<MillsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillsCurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillsCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
