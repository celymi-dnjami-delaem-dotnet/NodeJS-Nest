import { CustomExceptionFilter } from '../api/filters/custom-exception.filter';
import { INestApplication } from '@nestjs/common';

export default function registerFilters(app: INestApplication): void {
    app.useGlobalFilters(new CustomExceptionFilter());
}
