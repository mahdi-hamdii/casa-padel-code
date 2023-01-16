import { IsNotEmpty } from 'class-validator';

export class ChangeAdminPasswordDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
