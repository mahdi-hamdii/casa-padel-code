import { TournamentsController } from '../tournaments.controller';
import { LoggerMiddleware } from '../../logs/LoggerMiddleware';
import { Injectable, Logger, NestMiddleware, Controller, Inject, ExecutionContext } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TournamentLoggerMiddleware extends LoggerMiddleware{
  constructor(
  ) {
    super(TournamentsController.name);
  }
}