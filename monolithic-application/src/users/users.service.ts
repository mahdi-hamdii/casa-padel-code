import { LokiLogger } from 'nestjs-loki-logger';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AddJetonDto } from './dto/add-jeton.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client"
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, 
  @InjectMetric("http_request_total") public counter: Counter<string>) {}
  lokiLogger = new LokiLogger(UsersService.name);  

  async findUserByEmail(email: string) {
    try{
      const user = await this.userModel.findOne({ email });
      // this will return the user if it find it or return null
      this.counter.labels({route:"users", statusCode: "200"}).inc()
      return user;
    }catch(e){
      this.counter.labels({route:"users", statusCode: "400"}).inc()
      throw new NotFoundException("User Not found")
    }

  }

  async adminListUsers(usersPerPage = 10, currentPage = 1, search = '') {
    try{
    // create the query
    let query = {};
    if (search.length > 0) {
      query = {
        $or: [
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { firstname: { $regex: search, $options: 'i' } },
          { lastname: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const users = await this.userModel
      .find(query)
      .skip((currentPage - 1) * usersPerPage)
      .limit(usersPerPage);

    // information to return to the front-end
    const totalUsers = await this.userModel.find(query).countDocuments();
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const returnUsers = users.map((user) => {
      return {
        id: user._id,
        picture: user.picture,
        gender: user.gender,
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        phone: user.phone,
        jetonHeurePlein: user.jetonHeurePlein,
        jetonHeureCreuse: user.jetonHeureCreuse,
      };
    });
    this.counter.labels({route:"users", statusCode: "200"}).inc()
    return { totalPages, totalUsers, currentPage, users: returnUsers };

    }catch(e){
      this.counter.labels({route:"users", statusCode: "400"}).inc()
      throw new BadRequestException("Could not List users by request")
    }
  }

  async adminAddJeton(addJetonDto: AddJetonDto) {
    // get the user to add a jeton
    try{
      const user = await this.userModel.findOne({ email: addJetonDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // perform the updates
      user.jetonHeureCreuse += addJetonDto.jetonHeureCreuse;
      user.jetonHeurePlein += addJetonDto.jetonHeurePlein;
      // save the user
      await user.save();
      this.counter.labels({route:"users", statusCode: "200"}).inc()
      return {
        message: 'Jeton added :)',
      };
    }catch(e){
      this.counter.labels({route:"users", statusCode: "400"}).inc()
      throw new BadRequestException("Could not add Jeton")
    }

  }

  async adminEditUser(updateUserDto: UpdateUserDto) {
    // get the user by Id
    try{
      const user = await this.userModel.findOne({ _id: updateUserDto.id });
      if (!user) {
        this.counter.labels({route:"users", statusCode: "400"}).inc()
        throw new NotFoundException('User not found');
      }
      // edit the user
      user.firstname = updateUserDto.firstname;
      user.lastname = updateUserDto.lastname;
      user.phone = updateUserDto.phone;
      user.email = updateUserDto.email;
      if (updateUserDto.password && updateUserDto.password.length > 4) {
        // in this caase we must change the password (password must be at least 4 characters)
        // hash the password with the salt and save it
        const hashedPassword = await bcrypt.hash(
          updateUserDto.password,
          user.salt,
        );
        user.password = hashedPassword;
      }
  
      //save the user
      await user.save();
      this.counter.labels({route:"users", statusCode: "200"}).inc()
      return {
        message: 'User updated',
      };
    }catch(e){
      this.counter.labels({route:"users", statusCode: "400"}).inc()
      throw new BadRequestException("Could not edit user")
    }
 
  }


  async getMyInformation (email:string){
    try{
      const user = await this.findUserByEmail(email)
      if (!user) {
        this.counter.labels({route:"users", statusCode: "400"}).inc()
        throw new NotFoundException('User with this email does not exists');
      }
  
      const temp = JSON.stringify(user);
      const returnedUser = JSON.parse(temp);
      delete returnedUser.password;
      delete returnedUser.salt;
      this.counter.labels({route:"users", statusCode: "200"}).inc()
      return returnedUser;
    }catch(e){
      this.counter.labels({route:"users", statusCode: "400"}).inc()
      throw new BadRequestException("Could not get My information")
    }


  } 
}
