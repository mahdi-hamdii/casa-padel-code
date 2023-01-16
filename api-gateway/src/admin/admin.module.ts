import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';
import { AdminLoggerMiddleware } from './utils/AdminLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import sdk from '../tracer/tracer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TracerModule,
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,

        },
      },])
  ],
  controllers: [AdminController],
  providers: [AdminService, TracerService, JwtService],
  exports: [ AdminService],
})
export class AdminModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminLoggerMiddleware).forRoutes('admin/*');
  }
}