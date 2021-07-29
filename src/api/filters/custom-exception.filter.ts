import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse();

        const errorMessageResponse = {
            timeStamp: new Date().toString(),
            path: request.url,
            message: '',
        };

        if (exception instanceof UserFriendlyException) {
            let errorStatusCode: number;
            switch (exception.serviceResultType) {
                case ServiceResultType.InvalidData:
                    errorStatusCode = HttpStatus.BAD_REQUEST;
                    break;
                case ServiceResultType.NotFound:
                    errorStatusCode = HttpStatus.NOT_FOUND;
                    break;
                default:
                    errorStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    break;
            }

            if (!exception.message) {
                delete errorMessageResponse.message;
            } else {
                errorMessageResponse.message = exception.message;
            }

            response.status(errorStatusCode).json(errorMessageResponse);

            return;
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorMessageResponse);
    }
}
