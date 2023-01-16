import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AdminModule } from 'src/admin/admin.module';
import { UsersLoggerMiddleware } from './utils/UsersLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AdminModule,
    TracerModule,  ClientsModule.register([
      {
        name: 'SPONSORS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_QUEUE_HOST}:${process.env.REDIS_QUEUE_PORT}`,

        },
      },])

  ],
  controllers: [UsersController],
  providers: [UsersService, TracerService],
  exports: [MongooseModule, UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersLoggerMiddleware).forRoutes('users/*');
  }
}