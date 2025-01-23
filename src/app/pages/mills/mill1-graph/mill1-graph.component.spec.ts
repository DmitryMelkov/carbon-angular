import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mill1GraphComponent } from './mill1-graph.component';

describe('Mill1GraphComponent', () => {
  let component: Mill1GraphComponent;
  let fixture: ComponentFixture<Mill1GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mill1GraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mill1GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
