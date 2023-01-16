import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';
// import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UserEmail } from './user-email.decorator';
import { TracerService } from 'src/tracer/tracer.service';
import { EventPattern } from '@nestjs/microservices';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, 
    private readonly tracerService: TracerService,
    ) {}

  @EventPattern("auth_register")
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.tracerService.tracingFunction(
     
      async () => { return this.authService.register(createUserDto, 'u');},
      '/auth/register',
      'POST'
      )
    
   
  }

  // jwt login
  @EventPattern("auth_login")
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return await this.tracerService.tracingFunction(
     
      async () => { return this.authService.login(loginUserDto);},
      '/auth/login',
      'POST'
      )
    
    
  }

  // If you want to protect your route just pass this guard
  // @UserEmail is a custom decorator that return the email of the user (get it from the request)
  @UseGuards(JwtAuthGuard)
  @Get('test') 
  async test(@UserEmail() email: string) {
    return email;
  }

  // // google
  // @Get('google')
  // @UseGuards(GoogleAuthGuard)
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async googleAuth(@Request() req) {
  //   return HttpStatus.OK;
  // }

  // @Get('google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // googleAuthRedirect(@Request() req) {
  //   return this.authService.googleLogin(req);
  // }

  // // facebook
  // @Get('facebook')
  // @UseGuards(FacebookAuthGuard)
  // async facebookLogin(): Promise<any> {
  //   return HttpStatus.OK;
  // }

  // @Get('facebook/redirect')
  // @UseGuards(FacebookAuthGuard)
  // async facebookLoginRedirect(@Request() req): Promise<any> {
  //   return req.user;
  // }
}
