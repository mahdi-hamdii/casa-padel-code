import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import sdk from './tracer/tracer';
import { Transport, MicroserviceOptions ,RedisOptions } from '@nestjs/microservices';


const redis_host = process.env.REDIS_QUEUE_HOST || 'redis'
const redis_port = process.env.REDIS_QUEUE_PORT || 6379

// const microserviceOptions: MicroserviceOptions = { // Redis communication
//   transport: Transport.REDIS,
//   options: {
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
//   }
// };
async function bootstrap() {

  await sdk.start()

  console.log(redis_host)
  console.log(redis_port)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
      url: `redis://${redis_host}:${redis_port}`,
      // host: redis_host,
      // port: Number(redis_port)
      }
    },
    );
  const config = new DocumentBuilder()
  .setTitle('Casa-padel-sfax')
  .setVersion('1.0')
  .build();
  // app.enableCors(
  //   {
  //     origin: true,
  //     credentials: true
  //   }
  // )
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('', app, document);

  // app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  await app.listen();

}
bootstrap();
