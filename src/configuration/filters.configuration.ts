import { INestApplication } from '@nestjs/common';
import { CustomExceptionFilter } from '../api/filters/custom-exception.filter';

export default function registerFilters(app: INestApplication): void {
    app.useGlobalFilters(new CustomExceptionFilter());
}
