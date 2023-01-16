import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TracerService } from 'src/tracer/tracer.service';


@Controller('tournaments')
export class TournamentsController {

  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly tracerService: TracerService,
    
    ) {

  }

  @Post('/create')
  async createTournament(@Body() createTournamentDto: CreateTournamentDto) {
    return await this.tracerService.tracingFunction(
     
      async () => {return this.tournamentsService.createTournament(createTournamentDto)},
      '/tournaments/create',
      'POST'
      )

  }

  @Post('/subscribe')
  async subscribeToTournament(@Body() body:any) {
    return await this.tracerService.tracingFunction(
     
      async () => {return this.tournamentsService.addTeamToTournament(body.id, body.team)},
      '/tournaments/subscribe',
      'POST'
      );
  }
  @Post('/')
  async confirmSubscribptionToTournament(@Body() body:any) {
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.confirmPendingDemand(body.id, body.team);},
      '/tournaments/confirm-subscription',
      'POST'
      );
  }
  @Get('/all')
  async findAllTournaments() {
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.findAllTournaments()},
      '/tournament/all',
      'GET'
      )
  }

  @Get(':id')
  async findTournamentById(@Param('id') id: string) {
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.findTournamentById(id);},
      '/tournaments/id',
      'GET'
      );
  }

  @Patch('/update/:id')
  async updateTournamentById(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.updateTournamentById(
        id,
        updateTournamentDto,
      );},
      '/tournaments/update/id',
      'PATCH'
      );
  }
  @Delete('/delete/:id')
  async removeTournamentById(@Param('id') id: string) {
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.removeTournamentById(id);},
      '/tournaments/delete/id',
      'DELETE'
      );
  }
  @Post('/add-sponsor')
  async addSponsorToTournament(@Body() body:any){
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.addSponsorToTournament(body.id, body.sponsor);},
      '/tournaments/add-sponsor',
      'POST'
      );
  }
  @Post('/update-sponsor')
  async updateSponsoringEvent(@Body() body:any){
    return await this.tracerService.tracingFunction(
      async () => {return this.tournamentsService.updatesponsoringAmount(body.tournamentId, body.sponsorId, body.sponsoringAmount);},
      '/tournaments/update-sponsor',
      'POST'
      );
  }
  @Delete('/delete-sponsor')
  async removeSponsorById(@Body() body:any){
    return await this.tracerService.tracingFunction(
      async () => {return  this.tournamentsService.removeSponsorFromTournament(
        body.tournamentId,
        body.sponsorId
      );},
      '/tournaments/delete-sponsor',
      'DELETE'
      );
    return
  }

}
