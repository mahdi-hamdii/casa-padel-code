import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { sponsoringEvent } from './entities/sponsoringEvent.interface';
import { Team, Tournament, TournamentDocument } from './entities/tournament.entity'; 
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client";
import sdk from '../tracer/tracer';

@Injectable()
export class TournamentsService {

  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
    @InjectMetric("http_request_total") public counter: Counter<string>,
    @InjectMetric("total_enrolment") public tournamentCounter: Counter<string>,
   
  ) {

  }

  async createTournament(
    createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    try{
      var response = await new this.tournamentModel(createTournamentDto).save();
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("Could not create Tournament")
    }


  }

  // This should be replaced by pagination
  async findAllTournaments() {
    try{
      var response = await this.tournamentModel.find().populate({path: 'sponsors', populate:{model:'Sponsor', path:'sponsorId'}});
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new NotFoundException("Tournaments not found")
    }
  }

  async findTournamentById(id: string) {
    try {
      var response =  await this.tournamentModel.findById(id);
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response
    } catch (e) {
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new NotFoundException('Tournament Not Found');
    }
  }
  async addSponsorToTournament(id:string, sponsor:sponsoringEvent){
    try{
      const tournament= await this.tournamentModel.findById(id)
      tournament.sponsors.push(sponsor)
      var response = await tournament.save()
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("Could not add sponsor to Tournament")
    }

  }
  async updateTournamentById(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ) {
    try{
      var response = await this.tournamentModel.updateOne({ id }, updateTournamentDto);
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("Could not update Tournament")
    }
  }
  // add team to participants of a certain tournament
  async addTeamToTournament(id: string,team: Team) {
    try{
      const tournament= await this.tournamentModel.findById(id)
      team.confirmed = false
      tournament.participants.push(team);
      var response = await tournament.save();
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc();
      this.tournamentCounter.labels({tournament: id, status:"NotConfirmed"}).inc();
      return response 
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("could not add team to tournament", e)
    }

  }
  async removeSponsorFromTournament(tournamentId:string, sponsorId:string){
    try{
      const tournament = await this.tournamentModel.findById(tournamentId);
      const sponsorIndex = this.findSponsorIndex(tournament.sponsors, sponsorId)
      if(sponsorIndex != undefined){
        tournament.sponsors.splice(sponsorIndex,1)
      }
      tournament.markModified('sponsors');
      var response = tournament.save()
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response 
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("could not remove Sponsors from tournament", e)
    }

  }
  async updatesponsoringAmount(tournamentId:string, sponsorId:string, newSponsoringAmount:string ){
    try{
      const tournament = await this.tournamentModel.findById(tournamentId);
      const sponsorIndex = this.findSponsorIndex(tournament.sponsors, sponsorId)
      tournament.sponsors[sponsorIndex].sponsoringAmount = newSponsoringAmount;
      tournament.markModified('sponsors');
      tournament.save();
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("could not update sponsoring amount", e)
    }

  }
  // function that will set the team in the 
  async confirmPendingDemand(id:string, team:Team){
    try{
      const tournament = await this.tournamentModel.findById(id);
      const indice = this.findTeamIndex(tournament.participants, team);
      tournament.participants[indice].confirmed = true;
      tournament.markModified('participants');
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      this.tournamentCounter.labels({tournament: id, status:"Confirmed"}).inc();
      var response = await tournament.save();
      return response 
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("could not confirm pending demand", e)
    }

  }
  // find the team index inside an array of teams 
  findTeamIndex(teamArray:any, team:Team): number{
    let index = -1; 
    teamArray.forEach(element => {
      index++;
      if(element.joueurA == team.joueurA &&
        element.joueurB == team.joueurB){
          return index ;
        }
    });
    return index;
  }
  findSponsorIndex(sponsorsList:any, sponsorId:string){
    var sponsorIndex :any;
    sponsorsList.forEach((sponsor, index) => {
      if(sponsor.sponsorId == sponsorId){
      sponsorIndex= index
      }
    })
    return sponsorIndex
  }
  async removeTournamentById(id: string) {
    try{
      var response = await this.tournamentModel.deleteOne({ id });
      this.counter.labels({route:"tournaments", statusCode: "200"}).inc()
      return response 
    }catch(e){
      this.counter.labels({route:"tournaments", statusCode: "400"}).inc()
      throw new BadRequestException("could not remove tournament", e)
    }
  }

 
}
