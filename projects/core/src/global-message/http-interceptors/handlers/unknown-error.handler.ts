import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalMessageType } from '../../models/global-message.model';
import { HttpResponseStatus } from '../../models/response-status.model';
import { HttpErrorHandler } from './http-error.handler';

@Injectable({
  providedIn: 'root',
})
export class UnknownErrorHandler extends HttpErrorHandler {
  responseStatus = HttpResponseStatus.UNKNOWN;

  handleError(request: HttpRequest<any>) {
    if (!request.url.includes('/cms/components')) {
      this.globalMessageService.add(
        { key: 'httpHandlers.unknownError' },
        GlobalMessageType.MSG_TYPE_ERROR
      );
    }
  }
}
