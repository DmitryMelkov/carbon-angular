import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCurrentParamComponent } from './header-current-params.component';

describe('HeaderCurrentParamComponent', () => {
  let component: HeaderCurrentParamComponent;
  let fixture: ComponentFixture<HeaderCurrentParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCurrentParamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCurrentParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
