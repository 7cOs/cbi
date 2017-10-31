import { Response } from '@angular/http';

export class ApiErrorMock extends Response implements Error {
  name: any;
  message: any;
}
