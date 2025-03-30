/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResearchTopicService } from './research-topic.service';

describe('Service: ResearchTopic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchTopicService]
    });
  });

  it('should ...', inject([ResearchTopicService], (service: ResearchTopicService) => {
    expect(service).toBeTruthy();
  }));
});
