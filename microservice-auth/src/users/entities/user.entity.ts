import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from './person';

export type UserDocument = User & Document;

@Schema()
export class User extends Person {
  constructor() {
    super();
    this.role = 'u';
  }

  @Prop({ default: 0 })
  jetonHeureCreuse: number;

  @Prop({ default: 0 })
  jetonHeurePlein: number;

  //we have three main actors which are admin, SuperAdmin & Player(User): we have to make a decision about duplicating the attributes
  // Tokens(Tickets: Money) & points(Internal club score) or creating different entities that extend the same person
}

export const UserSchema = SchemaFactory.createForClass(User);
