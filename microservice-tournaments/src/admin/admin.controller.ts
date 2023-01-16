import { response } from 'express';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AdminService } from './admin.service';
import { ChangeAdminPasswordDto } from './dto/change-admin-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { SuperAdminGuard } from './guards/super-admin.guard';
import * as api from '@opentelemetry/api';
import { TracerService } from 'src/tracer/tracer.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly tracerService: TracerService,
    ) {

  }

  //login admin and super admin
  @Post('/login')
  async loginAdmin(@Body(ValidationPipe) loginAdminDto: LoginAdminDto) {
    return await this.tracerService.tracingFunction(
     
      async () => {return this.adminService.loginAdmin(loginAdminDto);},
      '/admin/login',
      'POST'
      )
    
  }

  // create of a dsuper admin user - only for test
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(SuperAdminGuard)
  @Post('/super/create')
  async createSuperAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.tracerService.tracingFunction(
      async () => { return await this.adminService.createSuperAdmin(createAdminDto);},
      '/admin/super/create',
      'POST'
      )
  }

  // Super admin funcitonalities to the admin
  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Post('/create')
  async createAdmin(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return await this.tracerService.tracingFunction(
      async () => {  return await this.adminService.createAdmin(createAdminDto);},
      '/admin/create',
      'POST'
      )
   
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Delete('/delete/:email')
  async deleteAdminById(@Param('email') email: string) {
    return await this.tracerService.tracingFunction(
      async () => {  return this.adminService.deleteAdminByEmail(email);},
      '/admin/delete/email',
      'DELETE'
      )
    
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Get('/all')
  async findAllAdmins() {
    // return await this.tracerService.tracingFunction(
    //   async () => {  return this.adminService.findAllAdmins();},
    //   '/admin/all',
    //   'GET'
    //   )
    return this.adminService.findAllAdmins();
   
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Post('/deactivate')
  async deactivateAdminById(@Body() res) {
    return await this.tracerService.tracingFunction(
      async () => {  return await this.adminService.deactivateAdminById(res.id);},
      '/admin/deactivate',
      'POST'
      )
    
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Post('/activate')
  async activateAdminById(@Body() res) {
    return await this.tracerService.tracingFunction(
      async () => {return await this.adminService.activateAdminById(res.id);},
      '/admin/activate',
      'POST'
      )
    
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperAdminGuard)
  @Post('/change-password')
  async changeAdminPasswordById(
    @Body(ValidationPipe) changeAdminPasswordDto: ChangeAdminPasswordDto,
  ) {
    return await this.tracerService.tracingFunction(
      async () => {return await this.adminService.changeAdminPasswordByEmail(
        changeAdminPasswordDto,
      );},
      '/admin/change-password',
      'POST'
      )
    
    
  }
}
