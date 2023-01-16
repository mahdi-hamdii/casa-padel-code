import { Inject, Injectable } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class SponsorsService {
  constructor(
    @Inject('SPONSORS_SERVICE') private readonly sponsorsClient: ClientProxy,
  ) {}

  async create(
    createSponsorDto: CreateSponsorDto,
    image: any,
  ) {

    return await this.sponsorsClient.send('sponsor_create', {createSponsorDto,image})
  }

  async findAll(url: string) {

    return await this.sponsorsClient.send('sponsor_findAll',url)

  }

  async findOne(id: number) {
    
    return await this.sponsorsClient.send('sponsor_findOne',id)


  }

  async update(id: number, updateSponsorDto: UpdateSponsorDto) {
    return await this.sponsorsClient.send('sponsor_update',updateSponsorDto)

  }

  async remove(id: string) {
    return await this.sponsorsClient.send('sponsor_remove',id)


  }
}
