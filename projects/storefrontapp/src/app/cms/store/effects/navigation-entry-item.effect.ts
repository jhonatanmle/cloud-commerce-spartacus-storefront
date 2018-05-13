import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Observable ,  of } from 'rxjs';
import { map, catchError, filter, mergeMap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRouting from '../../../routing/store';

import * as navigationItemActions from '../actions/navigation-entry-item.action';
import * as fromServices from '../../services';
import { OccCmsService } from '../../services/occ-cms.service'; // tslint:disable-line
import { IdList } from '../../models/idList.model';

@Injectable()
export class NavigationEntryItemEffects {
  @Effect()
  loadNavigationItems$: Observable<any> = this.actions$
    .ofType(navigationItemActions.LOAD_NAVIGATION_ITEMS)
    .pipe(
      map(
        (action: navigationItemActions.LoadNavigationItems) => action.payload
      ),
      map(payload => {
        return {
          ids: this.getIdListByItemType(payload.items),
          nodeId: payload.nodeId
        };
      }),
      mergeMap(data => {
        if (data.ids.componentIds.idList.length > 0) {
          return this.routingStore.select(fromRouting.getRouterState).pipe(
            filter(routerState => routerState !== undefined),
            map(routerState => routerState.state.context),
            take(1),
            mergeMap(pageContext =>
              // download all items in one request
              this.occCmsService
                .loadListComponents(
                  data.ids.componentIds,
                  pageContext,
                  'DEFAULT',
                  0,
                  data.ids.componentIds.idList.length
                )
                .pipe(
                  map(
                    res =>
                      new navigationItemActions.LoadNavigationItemsSuccess({
                        nodeId: data.nodeId,
                        components: res['component']
                      })
                  ),
                  catchError(error =>
                    of(new navigationItemActions.LoadNavigationItemsFail(error))
                  )
                )
            )
          );
        } else if (data.ids.pageIds.idList.length > 0) {
          // future work
          // dispatch action to load cms page one by one
        } else if (data.ids.mediaIds.idList.length > 0) {
          // future work
          // send request to get list of media
        }
      })
    );

  // We only consider 3 item types: cms page, cms component, and media.
  getIdListByItemType(itemList: any[]) {
    const pageIds: IdList = { idList: [] };
    const componentIds: IdList = { idList: [] };
    const mediaIds: IdList = { idList: [] };

    itemList.forEach(item => {
      if (item.superType === 'AbstractCMSComponent') {
        componentIds.idList.push(item.id);
      } else if (item.superType === 'AbstractPage') {
        pageIds.idList.push(item.id);
      } else if (item.superType === 'AbstractMedia') {
        mediaIds.idList.push(item.id);
      }
    });
    return { pageIds: pageIds, componentIds: componentIds, mediaIds: mediaIds };
  }

  constructor(
    private actions$: Actions,
    private occCmsService: fromServices.OccCmsService,
    private routingStore: Store<fromRouting.State>
  ) {}
}
