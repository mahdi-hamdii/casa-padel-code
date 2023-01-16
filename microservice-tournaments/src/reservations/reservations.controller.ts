import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserEmail } from 'src/auth/user-email.decorator';
import { AddPlayerToReservationDto } from './dto/add-player-to-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EditReservationDto } from './dto/edit-reservation.dto';
import { ReservationsService } from './reservations.service';
import { TracerService } from 'src/tracer/tracer.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService, 
    private readonly tracerService: TracerService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createReservation(
    @Body(ValidationPipe) createReservationDto: CreateReservationDto,
    @UserEmail() email: string,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {    return this.reservationsService.createReservation(
        createReservationDto,
        email,
      );},
      '/reservations/create',
      'POST'
      )
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add/player')
  async addPlayerToReservation(
    @Body(ValidationPipe) addPlayerToReservationDto: AddPlayerToReservationDto,
    @UserEmail() email: string,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.reservationsService.addPlayerToReservation(
          addPlayerToReservationDto,
          email,
        );},
      '/reservations/add/player',
      'POST'
      )
   
  }

  @Get('/all')
  async getAllReservationsByDateandTerrain(
    @Query('date') date: Date,
    @Query('terrain') terrain: string,
  ) {
    // return all reservations by a date day
    // must add by terrain
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.reservationsService.getAllReservationsByDateandTerrain(
          date,
          terrain,
        );},
      '/reservations/all',
      'GET'
      )
   
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel')
  async cancelReservation(
    @Body(ValidationPipe) cancelReservationDto: CancelReservationDto,
    @UserEmail() email: string,
  ) {
    // cancel a reservation and get the jetons back
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.reservationsService.cancelReservation(
          cancelReservationDto,
          email,
        );},
      '/reservations/cancel',
      'POST'
      )
   
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel/my-booking')
  async cancelMyBooking(
    @Body(ValidationPipe) cancelReservationDto: CancelReservationDto,
    @UserEmail() email: string,
  ) {
    // cancel a my booking and get the jetons back
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.reservationsService.cancelMyBooking(
          cancelReservationDto,
          email,
        );
      },
      '/reservations/cancel/my-booking',
      'POST'
      )
 
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post('/edit/admin')
  async adminEditReservation(
    @Body(ValidationPipe) editReservationDto: EditReservationDto,
  ) {
    // An admin will edit anything he wants if a problem occurs
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.reservationsService.adminEditReservation(editReservationDto);
      },
      '/reservations/edit/admin',
      'POST'
      )
    
  }
}
