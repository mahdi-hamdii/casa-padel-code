import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sponsor, SponsorSchema } from './entities/sponsor.entity';
import { SponsorsLoggerMiddleware } from './utils/SponsorsLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Sponsor.name, schema: SponsorSchema }]),
    TracerModule
  ],
  controllers: [SponsorsController],
  providers: [SponsorsService, TracerService]
})
export class SponsorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SponsorsLoggerMiddleware).forRoutes('sponsors/*');
  }
}