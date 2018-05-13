import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as RouterActions from '../actions/router.action';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigate$: Observable<any> = this.actions$.ofType(RouterActions.GO).pipe(
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  );

  @Effect({ dispatch: false })
  navigateBack$: Observable<Action> = this.actions$
    .ofType(RouterActions.BACK)
    .pipe(tap(() => this.location.back()));

  @Effect({ dispatch: false })
  navigateForward$: Observable<Action> = this.actions$
    .ofType(RouterActions.FORWARD)
    .pipe(tap(() => this.location.forward()));

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}
}
