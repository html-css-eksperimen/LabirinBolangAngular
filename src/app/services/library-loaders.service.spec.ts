import { TestBed } from '@angular/core/testing';

import { LibraryLoadersService } from './library-loaders.service';

describe('LibraryLoadersService', () => {
  let service: LibraryLoadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryLoadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
