/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaffPositionService } from './staff-position.service';

describe('Service: StaffPosition', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffPositionService]
    });
  });

  it('should ...', inject([StaffPositionService], (service: StaffPositionService) => {
    expect(service).toBeTruthy();
  }));
});
