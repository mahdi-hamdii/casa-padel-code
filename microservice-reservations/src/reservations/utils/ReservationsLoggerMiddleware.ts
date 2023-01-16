import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable} from '@nestjs/common';
import { ReservationsController } from '../reservations.controller';

@Injectable()
export class ReservationsLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(ReservationsController.name);
  }
}