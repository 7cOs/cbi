import { Response } from '@angular/http';

export class MockApiError extends Response implements Error {
  name: any;
  message: any;
}
