import {
  BadRequestException,
  ConflictException,
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
@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectMetric("http_request_total") public counter: Counter<string>
  ) {}

  async getUserByEmailOrThrowException(email: string): Promise<
    User &
      Document<any, any, any> & {
        _id: any;
      }
  > {
    try{
      const user = await this.userModel.findOne({ email });
      if (!user) {
        this.counter.labels({route:"reservations", statusCode: "400"}).inc()
        throw new NotFoundException('Invalid User');
      }
      this.counter.labels({route:"reservations", statusCode: "200"}).inc()
      return user;
    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new NotFoundException("User Not Found")
    }

  }

  async getReservationByIdOrThrowException(id: string): Promise<
    Document<unknown, any, ReservationDocument> &
      Reservation &
      Document & {
        _id: Types.ObjectId;
      }
  > {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new NotFoundException('Could Not Found a Reservation wit this Id');
    }
    this.counter.labels({route:"reservations", statusCode: "200"}).inc()
    return reservation;
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    email: string,
  ) {
    try{
 // console.log('email:', email);
    // console.log('create reservation Dto:', createReservationDto);
    // get the actual use who is creating the reservation
    const user = await this.getUserByEmailOrThrowException(email);
    console.log(user);
    // prepare the required data for the reservation entity
    const reservation = new Reservation();
    reservation.createdBy = user;
    reservation.payementMethod = createReservationDto.payementMethod;
    reservation.terrain = createReservationDto.terrain;
    reservation.totalJetonsPaid = createReservationDto.howMuchPaid || 0;
    reservation.startDate = createReservationDto.startDate;

    // Problem with time - dima ina9as fi se3a
    console.log(new Date(reservation.startDate));

    // add 90 minutes to the end date
    reservation.endDate = new Date(
      new Date(createReservationDto.startDate).getTime() + 90 * 60000,
    );

    // check the restByCache
    if (!createReservationDto.restByCash) {
      reservation.restByCash = false;
    }

    if (createReservationDto.restByCash == true) {
      reservation.restByCash = true;
      reservation.reservationConfirmed = false;
    }

    if (reservation.restByCash == false && reservation.totalJetonsPaid == 0) {
      throw new ConflictException(
        'please add Jetons or check the option rest by cache',
      );
    }

    if (reservation.totalJetonsPaid == 4) {
      reservation.restByCash = false;
      reservation.reservationConfirmed = true;
    } else {
      reservation.reservationConfirmed = false;
    }

    // check if the user has enough Jetons and remove them
    if (reservation.payementMethod == 'jetonHeureCreuse') {
      if (user.jetonHeureCreuse < reservation.totalJetonsPaid) {
        throw new ConflictException('You do not have enough jetonHeureCreuse');
      }
      user.jetonHeureCreuse -= reservation.totalJetonsPaid;
      await user.save();
    } else if (reservation.payementMethod == 'jetonHeurePleine') {
      if (user.jetonHeurePlein < reservation.totalJetonsPaid) {
        throw new ConflictException('You do not have enough jetonHeurePleine');
      }
      user.jetonHeurePlein -= reservation.totalJetonsPaid;
      await user.save();
    }

    // add the actual player
    const player = new Player();
    player.userId = user._id;
    player.nombreOfJetonsPayed = reservation.totalJetonsPaid;
    reservation.players = [player];

    this.counter.labels({route:"reservations", statusCode: "200"}).inc()
    return await new this.reservationModel(reservation).save();
    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new BadRequestException("could not create Reservation")
    }
  
  }

  async addPlayerToReservation(
    addPlayerToReservationDto: AddPlayerToReservationDto,
    email: string,
  ) {
    // get the actual user
    try{
      const user = await this.getUserByEmailOrThrowException(email);
      const reservation = await this.getReservationByIdOrThrowException(
        addPlayerToReservationDto.reservationId,
      );
      if (reservation.totalJetonsPaid == 4) {
        this.counter.labels({route:"reservations", statusCode: "400"}).inc()
        throw new ConflictException(
          'Sorry, This reservation is already paied by 4 jetons',
        );
      }
  
      console.log(reservation);

    const jetonsPaied = addPlayerToReservationDto.howMuchPaid || 0;
    // verify that the user has enough jetons or if the payement by cash just register it
    if (reservation.payementMethod == 'jetonHeureCreuse') {
      // verify the user has enough jetons jetons
      if (user.jetonHeureCreuse < jetonsPaied) {
        this.counter.labels({route:"reservations", statusCode: "400"}).inc()
        throw new ConflictException('You do not have enough jetonHeureCreuse');
      }
      // update the total jetons played
      user.jetonHeureCreuse -= jetonsPaied;
      reservation.totalJetonsPaid += jetonsPaied;
      await user.save();
    } else if (reservation.payementMethod == 'jetonHeurePleine') {
      // verify the user has enough jetons jetons
      if (user.jetonHeurePlein < jetonsPaied) {
        this.counter.labels({route:"reservations", statusCode: "400"}).inc()
        throw new ConflictException('You do not have enough jetonHeurePleine');
      }
      // update the total jetons played
      user.jetonHeurePlein -= jetonsPaied;
      reservation.totalJetonsPaid += jetonsPaied;
      await user.save();
    }
      // add the user to the list of the players with the nombre of jetons paied
      const playerIndex = reservation.players.findIndex((player) => {
        return player.userId.toString() == user._id.toString();
      });
  
      if (playerIndex != -1) {
        reservation.players[playerIndex].nombreOfJetonsPayed += jetonsPaied;
      } else {
        const player = new Player();
        player.userId = user._id;
        player.nombreOfJetonsPayed = jetonsPaied;
        reservation.players = [...reservation.players, player];
      }
      reservation.markModified('players');
  
      //  if the total jetons paied = 4 ==> reservation confirmaed=true && restByCash=false
      if (reservation.totalJetonsPaid == 4) {
        reservation.reservationConfirmed = true;
        reservation.restByCash = false;
      }
      //NOTE: if the payemement id by cash, the user will not pay any jetons and his name will be added to the list of the players
      this.counter.labels({route:"reservations", statusCode: "200"}).inc()
      return await reservation.save();
    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new BadRequestException("Could not add Player to reservation")
    }

  }

  async getAllReservationsByDateandTerrain(date: Date, terrain: string) {
    try{
    // console.log(terrain);
    if (['A', 'B', 'Principale'].indexOf(terrain) == -1) {
      throw new ConflictException('Invalid terrain name');
    }
    // create tomorrow date to our condition
    const tommorowDate = new Date(date);
    tommorowDate.setDate(tommorowDate.getDate() + 1);
    // console.log(date);
    // console.log(tommorowDate);
    var response =  await this.reservationModel.find({
      startDate: { $gte: new Date(date), $lt: tommorowDate },
      terrain,
    });
    this.counter.labels({route:"reservations", statusCode: "200"}).inc()
    return response 

    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new NotFoundException("Could not all reservations by date and Field")
    }

  }

  // The user will cancel the whole reservation
  async cancelReservation(
    cancelReservationDto: CancelReservationDto,
    email: string,
  ) {
    try{
// console.log(email);
    // console.log(cancelReservationDto);

    // get the logged-in user who is trying to cancel the reservation
    const user = await this.getUserByEmailOrThrowException(email);
    // get the reservation
    const reservation = await this.getReservationByIdOrThrowException(
      cancelReservationDto.reservationId,
    );

    // verify this is the user who created the reservation or throw untauthorized exception
    if (reservation.createdBy.toString() != user._id.toString()) {
      console.log('Error');
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new UnauthorizedException(
        "You're unauthorized, Only the owner of this reservation can delete it",
      );
    }

    // if the payement method is by cash just delete the reservation
    if (reservation.payementMethod == 'cash') {
      // delete the reservation and return a response
      await this.reservationModel.deleteOne({
        _id: cancelReservationDto.reservationId,
      });
      this.counter.labels({route:"reservations", statusCode: "200"}).inc()
      return { message: 'reservation deleted' };
    }

    // return back the jetons paied by all the users
    // // get the actual players
    const playerIds = reservation.players.map((player) => player.userId);
    const players = await this.userModel.find({
      _id: { $in: playerIds },
    });

    // console.log(reservation.players);
    // console.log('before money', players);
    if (reservation.payementMethod == 'jetonHeureCreuse') {
      reservation.players.forEach((p) => {
        const playerIndex = players.findIndex(
          (user) => user._id.toString() == p.userId.toString(),
        );
        players[playerIndex].jetonHeureCreuse += p.nombreOfJetonsPayed;
        //
      });
    } else if (reservation.payementMethod == 'jetonHeurePleine') {
      reservation.players.forEach((p) => {
        const playerIndex = players.findIndex(
          (user) => user._id.toString() == p.userId.toString(),
        );
        players[playerIndex].jetonHeurePlein += p.nombreOfJetonsPayed;
        //
      });
    }
    // console.log('after money', players);
    await this.userModel.bulkSave(players);

    // delete the reservation
    await this.reservationModel.deleteOne({
      _id: cancelReservationDto.reservationId,
    });
    this.counter.labels({route:"reservations", statusCode: "200"}).inc()
    return { message: 'reservation deleted' };
    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new BadRequestException("Could not Cancel reservation")
    }
  }

  // the user will cancel only his reservation (his booking as a player)
  async cancelMyBooking(
    cancelReservationDto: CancelReservationDto,
    email: string,
  ) {
    try{
      console.log(email);
      console.log(cancelReservationDto);
  
      // get the logged-in user who is trying to cancel the booking
      const user = await this.getUserByEmailOrThrowException(email);
      // get the reservation
      const reservation = await this.getReservationByIdOrThrowException(
        cancelReservationDto.reservationId,
      );
      // verify this is the user is a polyer in this reservation or throw untauthorized exception
      const playerIndex = reservation.players.findIndex(
        (p) => p.userId.toString() == user._id.toString(),
      );
  
      if (playerIndex == -1) {
        this.counter.labels({route:"reservations", statusCode: "400"}).inc()
        throw new UnauthorizedException(
          "You're unauthorized, You're not a player in this reservation",
        );
      }
      // return back the jetons paied by the users
      if (reservation.payementMethod == 'jetonHeureCreuse') {
        reservation.totalJetonsPaid -=
          reservation.players[playerIndex].nombreOfJetonsPayed;
        user.jetonHeureCreuse +=
          reservation.players[playerIndex].nombreOfJetonsPayed;
        await user.save();
      } else if (reservation.payementMethod == 'jetonHeurePleine') {
        user.jetonHeurePlein +=
          reservation.players[playerIndex].nombreOfJetonsPayed;
        reservation.totalJetonsPaid -=
          reservation.players[playerIndex].nombreOfJetonsPayed;
        await user.save();
      }
      // delete the booking (the player from the array of players) and if the player.length == 0 then delete the reservation
      reservation.players.splice(playerIndex, 1);
      reservation.markModified('players');
      if (reservation.players.length == 0) {
        await reservation.delete();
        this.counter.labels({route:"reservations", statusCode: "200"}).inc()
        return {
          message:
            'There are no Players in this reservation: It is deleted automatically',
        };
      }
      await reservation.save();
      this.counter.labels({route:"reservations", statusCode: "200"}).inc()
      return { reservation, message: 'booking deleted :)' };
    }catch(e){
      this.counter.labels({route:"reservations", statusCode: "400"}).inc()
      throw new BadRequestException("Could not cancel booking")
    }
  }

  // For the admin
  async adminEditReservation(editReservationDto: EditReservationDto) {
    this.counter.labels({route:"reservations", statusCode: "200"}).inc()
    // an admin will edit everything if a problem happens
    console.log(editReservationDto);
  }
}
