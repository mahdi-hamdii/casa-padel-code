import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ChangeAdminPasswordDto } from './dto/change-admin-password.dto';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy,

  ) {}

  async findAdminByEmail(email: string) {
    return await this.adminClient.send('admin_find_by_email', email)

  }

  // Super admin functionalities
  // run this function only the first time to create super admin user
  async createSuperAdmin(createAdminDto: CreateAdminDto) {
    return await this.adminClient.send('admin_create__super_admin', createAdminDto)

  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    return await this.adminClient.send('admin_login', loginAdminDto)
  }

  async validateCredentials(password, admin) {
    // must check for the exsistance of the password  before test it
    if (!password) {
      throw new BadRequestException('Password is Required');
    }

    //hash the password with the same salt
    const hashedPassword = await bcrypt.hash(password, admin.salt);
    if (hashedPassword !== admin.password) {
      throw new UnauthorizedException('Invalid password');
    }

    return { email: admin.email, role: admin.role };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    return await this.adminClient.send('admin_create_admin', createAdminDto)

  }

  async findAllAdmins() {
    return await this.adminClient.send('admin_find_all', {})

  }

  async deleteAdminByEmail(email: string) {
    return await this.adminClient.send('admin_delete', email)

  }

  async deactivateAdminById(id) {
    return await this.adminClient.send('admin_desactivate', id)

  }

  async activateAdminById(id) {
    return await this.adminClient.send('admin_activate', id)

  }

  async changeAdminPasswordByEmail(
    changeAdminPasswordDto: ChangeAdminPasswordDto,
  ) {
    return await this.adminClient.send('admin_change_admin_pwd', changeAdminPasswordDto)

  }
}
