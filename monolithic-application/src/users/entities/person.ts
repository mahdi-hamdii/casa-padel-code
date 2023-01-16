import { Prop } from '@nestjs/mongoose';

export class Person {
  @Prop()
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ enum: ['h', 'f'] })
  gender: string; // 'h' for homme and 'f' for femme

  @Prop()
  picture: string;

  @Prop({ enum: ['u', 'a', 'sa'] })
  role: string; // the idea is to define 3 roles:
  //'u' for user 'a' for admin and 'sa' for superadmin
  //the super admin creates the admin accounts for the employees with limited privileges
}
