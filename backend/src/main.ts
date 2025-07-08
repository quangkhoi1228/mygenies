import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Specify the directory to serve static files from (e.g., 'public')
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'));

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', // Replace with the allowed origin(s) for your application
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // HTTP methods allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  });

  // OpenAPI
  const config = new DocumentBuilder()
    .setTitle('KuDo AI API')
    .setDescription('The KuDo API description')
    .setVersion('1.0')
    .addTag('KuDo AI')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.NEST_PUBLIC_SERVER_PORT);
}
bootstrap();
