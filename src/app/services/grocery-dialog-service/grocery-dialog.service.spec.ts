import { TestBed } from '@angular/core/testing';

import { GroceryDialogService } from './grocery-dialog.service';

describe('GroceryDialogService', () => {
  let service: GroceryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
