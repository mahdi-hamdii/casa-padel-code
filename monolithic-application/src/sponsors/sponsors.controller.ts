import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigSponsor } from 'src/utils/multerConfigSponsor';
import { GetReqUrl } from 'src/utils/getReqUrl';
import { TracerService } from 'src/tracer/tracer.service';
@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService, 
    private readonly tracerService: TracerService,
    ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image', multerConfigSponsor))
  async createSponsor(
    @Body() createSponsorDto: CreateSponsorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return await this.sponsorsService.create(createSponsorDto, image);
      },
      '/sponsors/create',
      'POST'
      )
   
  }

  @Get('/all')
  async findAll(@GetReqUrl() url: string) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.sponsorsService.findAll(url);
      },
      '/sponsors/all',
      'GET'
      )
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.sponsorsService.findOne(+id);
      },
      '/sponsors/:id',
      'GET'
      )
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateSponsorDto: UpdateSponsorDto) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.sponsorsService.update(+id, updateSponsorDto);
      },
      '/sponsors/update/:id',
      'PATCH'
      )
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.sponsorsService.remove(id);
      },
      '/sponsors/delete/:id',
      'DELETE'
      )
  }
}
