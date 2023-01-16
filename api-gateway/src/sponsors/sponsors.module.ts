import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { SponsorsLoggerMiddleware } from './utils/SponsorsLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    TracerModule,
    ClientsModule.register([
      {
        name: 'SPONSORS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,

        },
      },])
  ],
  controllers: [SponsorsController],
  providers: [SponsorsService, TracerService]
})
export class SponsorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SponsorsLoggerMiddleware).forRoutes('sponsors/*');
  }
}