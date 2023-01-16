import { IsNotEmpty } from "class-validator";

export class CreateSponsorDto {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    logo:string;
}
