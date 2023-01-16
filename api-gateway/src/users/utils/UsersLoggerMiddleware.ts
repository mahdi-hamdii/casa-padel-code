import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable} from '@nestjs/common';
import { UsersController } from '../users.controller';

@Injectable()
export class UsersLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(UsersController.name);
  }
}