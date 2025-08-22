import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { homeCanActivateGuard } from './home-can-activate-guard';

describe('homeCanActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => homeCanActivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
