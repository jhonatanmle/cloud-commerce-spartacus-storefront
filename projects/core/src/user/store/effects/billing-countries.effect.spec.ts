import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'rxjs';

import { hot, cold } from 'jasmine-marbles';

import * as fromActions from '../actions/billing-countries.action';
import { OccMiscsService } from '../../../occ/miscs/miscs.service';

import { BillingCountriesEffect } from './billing-countries.effect';
import { Occ } from '../../../occ/occ-models/occ.models';
import { Country } from '../../../model/address.model';

class MockMiscsService {
  loadBillingCountries(): Observable<Occ.CountryList> {
    return of();
  }
}

const mockCountries: Country[] = [
  {
    isocode: 'AL',
    name: 'Albania',
  },
  {
    isocode: 'AD',
    name: 'Andorra',
  },
];

const mockCountriesList: Occ.CountryList = {
  countries: mockCountries,
};

describe('Billing Countries effect', () => {
  let service: OccMiscsService;
  let effect: BillingCountriesEffect;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingCountriesEffect,
        { provide: OccMiscsService, useClass: MockMiscsService },
        provideMockActions(() => actions$),
      ],
    });

    effect = TestBed.get(BillingCountriesEffect);
    service = TestBed.get(OccMiscsService);

    spyOn(service, 'loadBillingCountries').and.returnValue(
      of(mockCountriesList)
    );
  });

  describe('loadBillingCountries$', () => {
    it('should load the billing countries', () => {
      const action = new fromActions.LoadBillingCountries();
      const completion = new fromActions.LoadBillingCountriesSuccess(
        mockCountriesList.countries
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effect.loadBillingCountries$).toBeObservable(expected);
    });
  });
});
