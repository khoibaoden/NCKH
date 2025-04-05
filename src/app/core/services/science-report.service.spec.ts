/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScienceReportService } from './science-report.service';

describe('Service: ScienceReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceReportService]
    });
  });

  it('should ...', inject([ScienceReportService], (service: ScienceReportService) => {
    expect(service).toBeTruthy();
  }));
});
