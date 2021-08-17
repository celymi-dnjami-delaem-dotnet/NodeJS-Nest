import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function registerPipes(app: INestApplication): void {
    app.useGlobalPipes(new ValidationPipe());
}
