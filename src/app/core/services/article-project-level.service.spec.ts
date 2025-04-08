/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArticleProjectLevelService } from './article-project-level.service';

describe('Service: ArticleProjectLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleProjectLevelService]
    });
  });

  it('should ...', inject([ArticleProjectLevelService], (service: ArticleProjectLevelService) => {
    expect(service).toBeTruthy();
  }));
});
