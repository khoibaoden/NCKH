/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudentGuideLevelService } from './student-guide-level.service';

describe('Service: StudentGuideLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentGuideLevelService]
    });
  });

  it('should ...', inject([StudentGuideLevelService], (service: StudentGuideLevelService) => {
    expect(service).toBeTruthy();
  }));
});
