import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable} from '@nestjs/common';
import { AdminController } from '../admin.controller';

@Injectable()
export class AdminLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(AdminController.name);
  }
}