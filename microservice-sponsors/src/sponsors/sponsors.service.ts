import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { Sponsor, SponsorDocument } from './entities/sponsor.entity';
import { BadRequestException } from '@nestjs/common';
import { clearImage } from '../utils/clearImage';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client";
import { response } from 'express';
@Injectable()
export class SponsorsService {
  constructor(
    @InjectModel(Sponsor.name)
    private sponsorModel: Model<SponsorDocument>,
    @InjectMetric("http_request_total") public counter: Counter<string>
  ) {}

  async create(
    createSponsorDto: CreateSponsorDto,
    image: Express.Multer.File,
  ) {
    try {
      // generate the imageUrl
      console.log("image", image);
      createSponsorDto.logo = '/' + image.path;
      const sponsor = new this.sponsorModel(createSponsorDto);
      this.counter.labels({route:"sponsors", statusCode: "200"}).inc()
      return await sponsor.save();
    } catch (err) {
      this.counter.labels({route:"sponsors", statusCode: "400"}).inc()
      throw new BadRequestException('Could not create this sponsor');
    }
  }

  async findAll(url: string) {
    try{
      const sponsors: Sponsor[] = await this.sponsorModel.find();
      sponsors.forEach((sponsor) => {
        sponsor.logo = url + sponsor.logo.replace("\\", "/");
      });
      return sponsors;
    }catch(e){
      this.counter.labels({route:"sponsors", statusCode: "400"}).inc()
      throw new BadRequestException('Could not fetch sponsors');
    }
  }

  findOne(id: number) {
    
    try{
      var response = this.sponsorModel.findById(id);
      this.counter.labels({route:"sponsors", statusCode: "200"}).inc()
      return response
    }catch(e){
      this.counter.labels({route:"sponsors", statusCode: "400"}).inc()
      throw new BadRequestException('Could not find this sponsor');
    }

  }

  async update(id: number, updateSponsorDto: UpdateSponsorDto) {
    try{
        var response = await this.sponsorModel.updateOne({id}, updateSponsorDto)
        this.counter.labels({route:"sponsors", statusCode: "200"}).inc()
        return response
    }catch(e){
      this.counter.labels({route:"sponsors", statusCode: "400"}).inc()
      throw new BadRequestException('Could not update this sponsor');
    }
  }

  async remove(id: string) {
    try{
      const sponsor = await this.sponsorModel.findById(id);
      clearImage(sponsor.logo);
      this.counter.labels({route:"sponsors", statusCode: "200"}).inc()
      return this.sponsorModel.deleteOne({_id : sponsor.id})
    }catch(e){
      this.counter.labels({route:"sponsors", statusCode: "400"}).inc()
      throw new BadRequestException('Could not remove this sponsor');
    }

  }
}
