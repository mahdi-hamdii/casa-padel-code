import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto';
import { Team } from '../entities/tournament.entity';
export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
    
    title: string;
  
    description: string;

    picture: string;

    state: string;
    
    startDate:Date;

    endDate:Date;

    eventsArray:string;

    participants: Team[];
    
    capacity:number;

    finalRanking:Team[];

    subscriptionFees: number;

    bestPlayer: string;

    prizeMoney:number;

}
