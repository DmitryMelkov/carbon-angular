import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaTableComponent } from './sushilka-table.component';

describe('SushilkaTableComponent', () => {
  let component: SushilkaTableComponent;
  let fixture: ComponentFixture<SushilkaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SushilkaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
