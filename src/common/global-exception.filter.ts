import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';

@Catch(HttpException, PrismaClientKnownRequestError)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    const responsePayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    response.status(status).json(responsePayload);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      return this.getPrismaStatusCode(exception);
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as any).message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      return this.getPrismaErrorMessage(exception);
    }
    return 'Internal server error';
  }

  private getPrismaStatusCode(
    exception: PrismaClientKnownRequestError,
  ): number {
    switch (exception.code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      case 'P2000':
      case 'P2003':
      case 'P2004':
      case 'P2011':
      case 'P2014':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getPrismaErrorMessage(
    exception: PrismaClientKnownRequestError,
  ): string {
    switch (exception.code) {
      case 'P2002':
        return `Unique constraint failed on the fields: ${exception.meta?.target}`;
      case 'P2025':
        return 'The required record was not found.';
      case 'P2003':
        return 'Foreign key constraint failed.';
      case 'P2004':
        return 'Constraint violation detected.';
      case 'P2000':
        return 'The provided value is out of the allowable range for this column.';
      case 'P2011':
        return 'Null constraint violation on the field.';
      case 'P2014':
        return 'Cascading delete is prevented.';
      default:
        return 'An unexpected error occurred in Prisma.';
    }
  }
}
