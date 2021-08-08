import { CallHandler, ConsoleLogger, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly consoleLogger: ConsoleLogger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();

        const reqBody = Object.entries(req.body).length ? ` ${JSON.stringify(req.body)}` : '';

        return next.handle().pipe(
            tap((data) => {
                const res = context.switchToHttp().getResponse<Response>();

                this.consoleLogger.verbose(
                    `${req.url} ${req.method}${reqBody} - ${res.statusCode} ${JSON.stringify(data)}`,
                );
            }),
        );
    }
}
