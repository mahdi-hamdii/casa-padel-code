import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { SuperAdminGuard } from 'src/admin/guards/super-admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserEmail } from 'src/auth/user-email.decorator';
import { PaginationParams } from 'src/helpers/paginaiton-params';
import { AddJetonDto } from './dto/add-jeton.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { TracerService } from 'src/tracer/tracer.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly tracerService: TracerService,
    ) {}

  // admin functionalitites to the user
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/admin/all')
  async adminListUsers(
    @Query() { itemsPerPage, currentPage, search }: PaginationParams,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.usersService.adminListUsers(itemsPerPage, currentPage, search);
      },
      '/users/admin/all',
      'GET'
      )
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post('/admin/add-jeton')
  async adminAddJeton(@Body(ValidationPipe) addJetonDto: AddJetonDto) {
    // in this route the admin can add or remove jetons for a specific user
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.usersService.adminAddJeton(addJetonDto);
      },
      '/users/admin/add-jeton',
      'POST'
      )
    }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Post('/admin/edit')
  async adminEditUser(@Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.usersService.adminEditUser(updateUserDto);
      },
      '/users/admin/edit',
      'POST'
      )
  }


  @UseGuards(JwtAuthGuard)
  @Get("/my-information")
  async getMyInformation(@UserEmail()email: string){
    return await this.tracerService.tracingFunction(
      async () => {    
        return this.usersService.getMyInformation(email);
      },
      '/users//my-information',
      'GET'
      )
   
  }
}
