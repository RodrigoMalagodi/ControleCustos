/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashboardsService } from './dashboards.service';

describe('Service: Dashboards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardsService]
    });
  });

  it('should ...', inject([DashboardsService], (service: DashboardsService) => {
    expect(service).toBeTruthy();
  }));
});
