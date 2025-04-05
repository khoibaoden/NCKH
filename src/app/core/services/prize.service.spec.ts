/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrizeService } from './prize.service';

describe('Service: Prize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrizeService]
    });
  });

  it('should ...', inject([PrizeService], (service: PrizeService) => {
    expect(service).toBeTruthy();
  }));
});
