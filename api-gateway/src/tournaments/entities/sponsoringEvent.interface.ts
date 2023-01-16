import { Prop } from "@nestjs/mongoose";
import { Sponsor } from "src/sponsors/entities/sponsor.entity"
import * as mongoose from 'mongoose'
export class sponsoringEvent{

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SponsoringEvent' }] })
    sponsorId:string;
    
    sponsoringAmount:string;
}