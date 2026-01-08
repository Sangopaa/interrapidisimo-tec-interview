import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        switch (error.status) {
          case 401:
            console.warn('Unauthorized request');
            break;
          case 403:
            console.warn('Forbidden request');
            break;
          case 404:
            console.warn('Resource not found');
            break;
          case 500:
            console.error('Internal Server Error');
            break;
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
