import { IsNotEmpty } from 'class-validator';

export class EditReservationDto {
  @IsNotEmpty()
  reservationId: string;
}
