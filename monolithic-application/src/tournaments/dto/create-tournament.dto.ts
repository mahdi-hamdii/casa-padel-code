import { IsNotEmpty } from 'class-validator';
import { Sponsor } from 'src/sponsors/entities/sponsor.entity';
import { sponsoringEvent } from '../entities/sponsoringEvent.interface';
import {Team } from '../entities/tournament.entity';
export interface sponsoringEventDTO {
  sponsorId:string;
  sponsoringAmount:string;
}
export class CreateTournamentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  picture: string;

  state: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  eventsArray: string;

  participants:Team[]


  @IsNotEmpty()
  capacity: number;

  finalRanking: Team[];

  subscriptionFees: number;

  bestPlayer: string;

  prizeMoney:number;

  sponsors:sponsoringEventDTO

}
