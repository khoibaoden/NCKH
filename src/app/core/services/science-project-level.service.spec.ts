/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScienceProjectLevelService } from './science-project-level.service';

describe('Service: ScienceProjectLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceProjectLevelService]
    });
  });

  it('should ...', inject([ScienceProjectLevelService], (service: ScienceProjectLevelService) => {
    expect(service).toBeTruthy();
  }));
});
