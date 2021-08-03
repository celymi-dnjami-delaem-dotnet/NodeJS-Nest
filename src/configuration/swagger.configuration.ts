import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export default function registerSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Products API')
        .setDescription('This service is responsible for managing games stuff products')
        .setVersion('0.0.1')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);
}
