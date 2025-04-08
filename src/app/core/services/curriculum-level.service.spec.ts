/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurriculumLevelService } from './curriculum-level.service';

describe('Service: CurriculumLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurriculumLevelService]
    });
  });

  it('should ...', inject([CurriculumLevelService], (service: CurriculumLevelService) => {
    expect(service).toBeTruthy();
  }));
});
