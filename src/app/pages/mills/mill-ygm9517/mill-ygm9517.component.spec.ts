import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillYGM9517Component } from './mill-ygm9517.component';

describe('MillYGM9517Component', () => {
  let component: MillYGM9517Component;
  let fixture: ComponentFixture<MillYGM9517Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillYGM9517Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillYGM9517Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
