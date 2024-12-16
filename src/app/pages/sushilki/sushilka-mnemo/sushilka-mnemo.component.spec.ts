import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushilkaMnemoComponent } from './sushilka-mnemo.component';

describe('SushilkaMnemoComponent', () => {
  let component: SushilkaMnemoComponent;
  let fixture: ComponentFixture<SushilkaMnemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SushilkaMnemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SushilkaMnemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
