import { TestBed } from '@angular/core/testing';

import { SushilkaService } from './sushilka.service';

describe('SushilkaService', () => {
  let service: SushilkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SushilkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
