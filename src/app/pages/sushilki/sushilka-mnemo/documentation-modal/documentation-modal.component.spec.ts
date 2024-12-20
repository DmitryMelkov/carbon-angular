import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationModalComponent } from './documentation-modal.component';

describe('DocumentationModalComponent', () => {
  let component: DocumentationModalComponent;
  let fixture: ComponentFixture<DocumentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
