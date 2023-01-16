import { Prop } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import * as mongoose from 'mongoose';

export class Player {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  userId: User;
  nombreOfJetonsPayed: number;
}
