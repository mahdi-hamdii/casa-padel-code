import { IsNotEmpty } from 'class-validator';

export class AddPlayerToReservationDto {
  @IsNotEmpty()
  reservationId: string;

  howMuchPaid: number;
}
