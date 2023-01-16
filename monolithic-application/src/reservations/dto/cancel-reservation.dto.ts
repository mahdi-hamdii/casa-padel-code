import { IsNotEmpty } from 'class-validator';

export class CancelReservationDto {
  @IsNotEmpty()
  reservationId: string;
}
