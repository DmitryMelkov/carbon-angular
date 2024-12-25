import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaGraphDavlComponent } from './sushilka-graph-vacuums.component';

describe('SushilkaGraphDavlComponent', () => {
  let component: SushilkaGraphDavlComponent;
  let fixture: ComponentFixture<SushilkaGraphDavlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaGraphDavlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SushilkaGraphDavlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
