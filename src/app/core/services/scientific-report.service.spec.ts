/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScientificReportService } from './scientific-report.service';

describe('Service: ScientificReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScientificReportService]
    });
  });

  it('should ...', inject([ScientificReportService], (service: ScientificReportService) => {
    expect(service).toBeTruthy();
  }));
});
