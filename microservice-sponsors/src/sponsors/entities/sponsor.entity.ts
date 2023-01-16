import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type SponsorDocument = Sponsor & Document;

@Schema()
export class Sponsor {
    @Prop()
    name:string;

    @Prop()
    logo:string;
}
export const SponsorSchema = SchemaFactory.createForClass(Sponsor);

function ApiProperty(arg0: { enum: string[]; }) {
    throw new Error('Function not implemented.');
}
