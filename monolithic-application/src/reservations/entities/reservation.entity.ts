import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import * as mongoose from 'mongoose';
import { Player } from './player.class';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  // The user who created this resservation
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ enum: ['cash', 'jetonHeureCreuse', 'jetonHeurePleine'] })
  payementMethod: string; // this must be one of 3 values: cash, JetonHeureCreuse or JetonHeurePleine

  @Prop({ enum: ['A', 'B', 'Principale'] })
  terrain: string;

  @Prop({ default: 0 })
  totalJetonsPaid: number;

  // the date of the reservation
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;

  @Prop({ default: false })
  restByCash: boolean;

  // confirmed by admin after making a phone call
  @Prop({ default: false })
  reservationConfirmed: boolean;

  // array of 4 players
  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  //   players: User[]; // an array of 4 users

  @Prop()
  players: Player[];
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
