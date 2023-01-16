import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable} from '@nestjs/common';
import { SponsorsController } from '../sponsors.controller';

@Injectable()
export class SponsorsLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(SponsorsController.name);
  }
}