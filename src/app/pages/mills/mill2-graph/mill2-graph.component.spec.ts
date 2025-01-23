import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mill2GraphComponent } from './mill2-graph.component';

describe('Mill2GraphComponent', () => {
  let component: Mill2GraphComponent;
  let fixture: ComponentFixture<Mill2GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mill2GraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mill2GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
