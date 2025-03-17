import { TestBed } from '@angular/core/testing';

import { JobTrackerSupabaseService } from './job-tracker-supabase.service';

describe('JobTrackerSupabaseService', () => {
  let service: JobTrackerSupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTrackerSupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
