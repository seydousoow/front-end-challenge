import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  public handleError(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        alert('Internet connexion has been lost. Please verify your connexion');
      } else if (error.status === 422) {
        alert('The syntax of this request is not well-formed');
      } else if (error.status === 500) {
        alert('We could not reach the server. Please try again');
      } else if (500 < error.status) {
        alert('The service is temporary unavailable. Please consider try again');
      }
    }
    console.error('################################## ERROR ####################################');
    console.error('An Error occurred');
    console.error('URL: ', error.url);
    console.error('Status: ', error.status);
    console.error('MSG: ', error.message);
    console.error('################################## END ERROR ####################################');
  }
}
