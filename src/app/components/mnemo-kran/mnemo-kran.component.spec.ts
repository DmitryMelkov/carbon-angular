import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnemoKranComponent } from './mnemo-kran.component';

describe('MnemoKranComponent', () => {
  let component: MnemoKranComponent;
  let fixture: ComponentFixture<MnemoKranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MnemoKranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MnemoKranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
