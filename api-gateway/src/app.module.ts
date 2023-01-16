import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LokiLoggerModule } from 'nestjs-loki-logger';
import { ClientProxyFactory, Transport, ClientsModule } from '@nestjs/microservices';
// import { UsersModule } from './users/users.module';
// import { AdminModule } from './admin/admin.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { ReservationsModule } from './reservations/reservations.module';
// import { TournamentsModule } from './tournaments/tournaments.module';
// import { ReservationsModule } from './reservations/reservations.module';


const lokiHost = process.env.LOKI_HOST || 'http://loki:3100'
const loki_label_name = process.env.LOKI_LABEL_NAME || 'casa-padel'

@Module({
  imports: [
    ConfigModule.forRoot(),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,

        },
      },
   
      {
        name: 'TOURNAMENTS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,
        },
      },
    ]),





    MulterModule.register({}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    // UsersModule,
    // AdminModule,
    // TournamentsModule,
    SponsorsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule {}