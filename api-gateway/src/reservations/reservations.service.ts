import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { AddPlayerToReservationDto } from './dto/add-player-to-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EditReservationDto } from './dto/edit-reservation.dto';
import { Player } from './entities/player.class';
import {
  Reservation,
  ReservationDocument,
} from './entities/reservation.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client";
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class ReservationsService {
  constructor(
    @Inject('RESERVATION_SERVICE') private readonly reservationClient: ClientProxy,

  ) {}

  async getUserByEmailOrThrowException(email: string): Promise<any> {
    return await this.reservationClient.send('reservation_get_user_by_email', email)


  }

  async getReservationByIdOrThrowException(id: string): Promise<
   any
  > {
    return await this.reservationClient.send('reservation_get', id)

  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    email: string,
  ) {
    return await this.reservationClient.send('reservation_create', {createReservationDto,email})

  
  }

  async addPlayerToReservation(
    addPlayerToReservationDto: AddPlayerToReservationDto,
    email: string,
  ) {
    return await this.reservationClient.send('reservation_add_player', {addPlayerToReservationDto,email})


  }

  async getAllReservationsByDateandTerrain(date: Date, terrain: string) {
    return await this.reservationClient.send('reservation_get_by_date_terrain', {date,terrain})


  }

  // The user will cancel the whole reservation
  async cancelReservation(
    cancelReservationDto: CancelReservationDto,
    email: string,
  ) {
    return await this.reservationClient.send('reservation_cancel', {cancelReservationDto,email})

  }

  // the user will cancel only his reservation (his booking as a player)
  async cancelMyBooking(
    cancelReservationDto: CancelReservationDto,
    email: string,
  ) {
    return await this.reservationClient.send('reservation_cancel_booking', {cancelReservationDto,email})

  }

  // For the admin
  async adminEditReservation(editReservationDto: EditReservationDto) {
    return await this.reservationClient.send('reservation_admin_edit', editReservationDto)

  }
}
