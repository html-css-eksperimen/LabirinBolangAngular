import { TestBed } from '@angular/core/testing';

import { LoggerDataService } from './logger-data.service';

describe('LoggerDataService', () => {
  let service: LoggerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
