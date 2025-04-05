/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScienceProjectService } from './science-project.service';

describe('Service: ScienceProject', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceProjectService]
    });
  });

  it('should ...', inject([ScienceProjectService], (service: ScienceProjectService) => {
    expect(service).toBeTruthy();
  }));
});
