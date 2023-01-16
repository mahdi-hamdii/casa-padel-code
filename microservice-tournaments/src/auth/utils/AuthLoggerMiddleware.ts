import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable} from '@nestjs/common';
import { AuthController } from '../auth.controller';

@Injectable()
export class AuthLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(AuthController.name);
  }
}