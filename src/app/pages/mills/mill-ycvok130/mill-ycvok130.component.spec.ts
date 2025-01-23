import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillYCVOK130Component } from './mill-ycvok130.component';

describe('MillYCVOK130Component', () => {
  let component: MillYCVOK130Component;
  let fixture: ComponentFixture<MillYCVOK130Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillYCVOK130Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillYCVOK130Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
