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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    AdminModule,
    TracerModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, TracerService],
})
export class ReservationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReservationsLoggerMiddleware).forRoutes('reservations/*');
  }
}