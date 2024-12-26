import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicVacuumsGeneralComponent } from './graphic-vacuums-general.component';

describe('GraphicVacuumsGeneralComponent', () => {
  let component: GraphicVacuumsGeneralComponent;
  let fixture: ComponentFixture<GraphicVacuumsGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicVacuumsGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicVacuumsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
