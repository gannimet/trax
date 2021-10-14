import { HttpErrorString } from '../constants/http-error-string';

export interface HttpErrorMessage {
  statusCode: number;
  errorMessage: HttpErrorString;
}
