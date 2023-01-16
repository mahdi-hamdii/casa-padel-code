import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthLoggerMiddleware } from './utils/AuthLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { GoogleStrategy } from './google/google.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' }, // token valids for a month
    }),
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TracerService],
  exports: [
    JwtModule,
    AuthService,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthLoggerMiddleware).forRoutes('auth/*');
  }
}