import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import sdk from './tracer/tracer';

async function bootstrap() {

  await sdk.start()

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Casa-padel-sfax-api-gateway')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  // app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  await app.listen(3000);
}
bootstrap();
