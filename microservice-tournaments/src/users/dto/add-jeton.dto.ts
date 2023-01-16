import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class AddJetonDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  jetonHeureCreuse: number;

  @IsNumber()
  @IsNotEmpty()
  jetonHeurePlein: number;
}
