import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from 'src/users/entities/person';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin extends Person {
  constructor(role = 'a') {
    super();
    this.role = role;
    this.isActive = true;
  }
  @Prop({ default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
