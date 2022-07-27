import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {

  statusCode = 500;
  reason = 'Error connecting to database - IN DB ERROR Class';
  constructor(){
    super('Error connecting to db');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason}
    ];
  }
}