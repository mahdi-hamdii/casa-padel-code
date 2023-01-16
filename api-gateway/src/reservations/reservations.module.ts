import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Reservation, ReservationSchema } from './entities/reservation.entity';
import { AdminModule } from 'src/admin/admin.module';
import { ReservationsLoggerMiddleware } from './utils/ReservationsLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    
    AdminModule,
    TracerModule,
    ClientsModule.register([
      {
        name: 'RESERVATION_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,

        },
      },])
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, TracerService, JwtService],
})
export class ReservationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReservationsLoggerMiddleware).forRoutes('reservations/*');
  }
}