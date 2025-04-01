/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurriculumService } from './curriculum.service';

describe('Service: Curriculum', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurriculumService]
    });
  });

  it('should ...', inject([CurriculumService], (service: CurriculumService) => {
    expect(service).toBeTruthy();
  }));
});
