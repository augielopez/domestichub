import { TestBed } from '@angular/core/testing';

import { ReconService } from './recon.service';

describe('ReconService', () => {
  let service: ReconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
