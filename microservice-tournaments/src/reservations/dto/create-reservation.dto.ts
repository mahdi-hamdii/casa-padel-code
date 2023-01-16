import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsIn(['cash', 'jetonHeureCreuse', 'jetonHeurePleine'])
  payementMethod: string;

  @IsNotEmpty()
  @IsIn(['A', 'B', 'Principale'])
  terrain: string;

  howMuchPaid: number;

  @IsNotEmpty()
  startDate: Date;

  restByCash: boolean;
}
