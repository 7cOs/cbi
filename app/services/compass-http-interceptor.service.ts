import { HttpHandler,
         HttpHeaderResponse,
         HttpInterceptor,
         HttpProgressEvent,
         HttpResponse,
         HttpRequest,
         HttpSentEvent,
         HttpUserEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CompassHttpInterceptorService implements HttpInterceptor {

  intercept(
    httpRequest: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    const modifiedHttpRequest: HttpRequest<any> = httpRequest.clone({
      headers: httpRequest.headers
        .set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Expires', '0')
        .set('If-Modified-Since', '0')
    });

    return httpHandler.handle(modifiedHttpRequest);
  }
}
