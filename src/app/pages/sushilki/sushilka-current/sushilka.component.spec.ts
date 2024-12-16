import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaComponent } from './sushilka.component';

describe('SushilkaComponent', () => {
  let component: SushilkaComponent;
  let fixture: ComponentFixture<SushilkaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SushilkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
