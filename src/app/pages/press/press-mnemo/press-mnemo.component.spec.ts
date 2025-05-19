import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressMnemoComponent } from './press-mnemo.component';

describe('PressMnemoComponent', () => {
  let component: PressMnemoComponent;
  let fixture: ComponentFixture<PressMnemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressMnemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressMnemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
