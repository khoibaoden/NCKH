/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FalcultyService } from './falculty.service';

describe('Service: Falculty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FalcultyService]
    });
  });

  it('should ...', inject([FalcultyService], (service: FalcultyService) => {
    expect(service).toBeTruthy();
  }));
});
