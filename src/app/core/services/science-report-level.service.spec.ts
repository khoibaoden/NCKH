/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScienceReportLevelService } from './science-report-level.service';

describe('Service: ScienceReportLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceReportLevelService]
    });
  });

  it('should ...', inject([ScienceReportLevelService], (service: ScienceReportLevelService) => {
    expect(service).toBeTruthy();
  }));
});
