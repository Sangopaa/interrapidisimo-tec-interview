import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('An unexpected error occurred:', error);
    // Here we can log the error to a service like Sentry
    // And also notify the user with a Toastr or generic alert
    // alert('An unexpected error occurred. Please try again later.');
  }
}
