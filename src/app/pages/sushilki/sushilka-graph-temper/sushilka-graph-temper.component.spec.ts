import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaGraphComponent } from './sushilka-graph-temper.component';

describe('SushilkaGraphComponent', () => {
  let component: SushilkaGraphComponent;
  let fixture: ComponentFixture<SushilkaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SushilkaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
