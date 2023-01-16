import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Sponsor } from 'src/sponsors/entities/sponsor.entity';
import { sponsoringEvent } from './sponsoringEvent.interface';
export type TournamentDocument = Tournament & Document;
export class Team{
    joueurA:string;
    joueurB:string;
    confirmed:boolean;
}


@Schema()
export class Tournament {

    @Prop()
    title: string;
  
    @Prop()
    description: string;
  
    @Prop()
    picture: string;

    @Prop({enum: ['openForSubscription','closedForSubscription', 'inProgress','finished']})
    state: string;

    @Prop()
    startDate:Date;

    @Prop()
    endDate:Date;

    @Prop()
    eventsArray:string;

    @Prop()
    participants:Team[]


    @Prop()
    capacity:number;

    @Prop()
    finalRanking:Team[];

    @Prop()
    subscriptionFees: number;

    @Prop()
    bestPlayer: string;

    @Prop()
    prizeMoney:number;

    @Prop()
    sponsors:sponsoringEvent[]

}
export const TournamentSchema = SchemaFactory.createForClass(Tournament);

function ApiProperty(arg0: { enum: string[]; }) {
    throw new Error('Function not implemented.');
}

