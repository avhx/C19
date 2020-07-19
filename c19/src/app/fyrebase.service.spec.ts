import { TestBed } from '@angular/core/testing';

import { FyrebaseService } from './fyrebase.service';

describe('FyrebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FyrebaseService = TestBed.get(FyrebaseService);
    expect(service).toBeTruthy();
  });
});
