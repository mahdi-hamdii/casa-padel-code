import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateGoogleUserDto } from 'src/users/dto/create-google-user.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client";
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectMetric("http_request_total") public counter: Counter<string>
  ) {}

  // for simple registration
  async register(createUserDto: CreateUserDto, role = 'u') {
    this.counter.inc(1)
    let user;
    // the data is verified automatically using the class-validator

    // verify the email is unique
    try {
      user = await this.usersService.findUserByEmail(createUserDto.email);
      if (user) {
        throw new ConflictException('Email already exsists');
      }
    } catch (e) {
      console.log(e);
      return e.response;
    }

    // generate the salt and hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // create the user with necessary fields
    user = new User();
    // user avatar
    let picture = '';
    createUserDto.gender == 'h'
      ? (picture = 'https://www.svgrepo.com/show/9907/male-avatar.svg')
      : (picture = 'https://www.svgrepo.com/show/82208/female-avatar.svg');

    user = { ...createUserDto, role, picture, salt, password: hashedPassword };

    // save the user and return the response
    await new this.userModel(user).save();

    return {
      message: 'User has been created',
    };
  }

  // for simple login
  async login(loginUserDto: LoginUserDto): Promise<any> {
    this.counter.inc(1)
    // validate the credentials and if they are invalid throw an error
    const { email, role } = await this.validateCredentials(loginUserDto);

    const payload = { email, role };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateCredentials(loginUserDto: LoginUserDto) {
    // get the credentials
    const { email, password } = loginUserDto;

    //retrive the user from the DB
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This user is not configured to login with password, Try to login with your Google or Facebook account',
      );
    }

    // must check for the exsistance of the password  before test it
    if (!password) {
      throw new BadRequestException('Password is Required');
    }

    //hash the password with the same salt
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid password');
    }

    // check if thee password is incorrect
    return { email: user.email, role: user.role };
  }

  // // google
  // async googleLogin(req) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }

  //   const googleUser = req.user;
  //   // console.log(googleUser);

  //   // check if the user is already registred by his email
  //   const user = await this.usersService.findUserByEmail(googleUser.email);

  //   if (!user) {
  //     // if the user login for the first time , we need to register the user without password
  //     const newUser: CreateGoogleUserDto = new CreateGoogleUserDto();
  //     newUser.email = googleUser.email;
  //     newUser.firstname = googleUser.firstname;
  //     newUser.lastname = googleUser.lastname;
  //     newUser.picture = googleUser.picture;
  //     newUser.role = 'u';
  //     console.log(newUser);

  //     await new this.userModel(newUser).save();
  //   }

  //   // generate and return the token
  //   const payload = { email: googleUser.email, role: 'u' };
  //   const accessToken = await this.jwtService.sign(payload);
  //   return { accessToken };
  // }
}
