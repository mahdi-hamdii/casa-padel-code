import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangeAdminPasswordDto } from './dto/change-admin-password.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from "prom-client";
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    @InjectMetric("http_request_total") public counter: Counter<string>,
    @InjectMetric("total_enrolment") public tournamentCounter: Counter<string>,
  ) {}

  async findAdminByEmail(email: string) {
    return await this.adminModel.findOne({ email });
  }

  // Super admin functionalities
  // run this function only the first time to create super admin user
  async createSuperAdmin(createAdminDto: CreateAdminDto) {
    try {
      // generate the salt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);

      // create the superadmin with necessary fields
      let superAdmin = new Admin('sa');
      // user avatar
      const picture = 'https://www.svgrepo.com/show/9907/male-avatar.svg';

      superAdmin = {
        ...createAdminDto,
        role: superAdmin.role,
        isActive: superAdmin.isActive,
        picture,
        salt,
        password: hashedPassword,
      };

      // save the super admin and return the response
      await new this.adminModel(superAdmin).save();

      return {
        message: 'Super admin has been created',
      };
    } catch (error) {
      throw new HttpException('Cannot create super admin user', 500);
    }
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.findAdminByEmail(loginAdminDto.email);
    // verify the  admin
    if (!admin) {
      //|| admin.role != 'sa') {
      throw new UnauthorizedException('Unauthorized to login');
    }

    // verify the credentials
    const { email, role } = await this.validateCredentials(
      loginAdminDto.password,
      admin,
    );
    const payload = { email, role };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
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
    let admin;

    // verify the email is unique

    admin = await this.findAdminByEmail(createAdminDto.email);
    if (admin) {
      throw new ConflictException('Email already exsists');
    }

    try {
      // generate the salt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);

      // create the superadmin with necessary fields
      admin = new Admin('a');
      // user avatar
      const picture = 'https://www.svgrepo.com/show/9907/male-avatar.svg';

      admin = {
        ...createAdminDto,
        role: admin.role,
        picture,
        salt,
        password: hashedPassword,
      };

      // save the super admin and return the response
      await new this.adminModel(admin).save();

      return {
        message: 'admin has been created',
      };
    } catch (error) {
      throw new HttpException('Cannot create the admin user', 500);
    }
  }

  async findAllAdmins() {
    const admins = await this.adminModel.find({ role: 'a' });

    const newAdmins = admins.map((admin) => {
      const newAdmin = {
        id: admin._id,
        isActive: admin.isActive,
        picture: admin.picture,
        gender: admin.gender,
        lastname: admin.lastname,
        firstname: admin.firstname,
        email: admin.email,
        phone: admin.phone,
      };
      return newAdmin;
    });

    return newAdmins;
  }

  async deleteAdminByEmail(email: string) {
    const result = await this.adminModel.deleteOne({ email });
    if (result.deletedCount != 0) {
      return { message: 'Admin deleted successfully' };
    }
    throw new BadRequestException(
      'Error while deleting an admin, maybe the admin does not exists ',
    );
  }

  async deactivateAdminById(id) {
    try {
      const admin = await this.adminModel.findOne({ _id: id });
      if (!admin) {
        throw new NotFoundException('admin not found');
      }

      admin.isActive = false;
      await new this.adminModel(admin).save();

      return { message: 'admin has been deactivated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activateAdminById(id) {
    try {
      const admin = await this.adminModel.findOne({ _id: id });
      if (!admin) {
        throw new NotFoundException('admin not found');
      }

      admin.isActive = true;
      await new this.adminModel(admin).save();

      return { message: 'admin has been activated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeAdminPasswordByEmail(
    changeAdminPasswordDto: ChangeAdminPasswordDto,
  ) {
    try {
      const admin = await this.adminModel.findOne({
        email: changeAdminPasswordDto.email,
      });
      if (!admin) {
        throw new NotFoundException('admin not found');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        changeAdminPasswordDto.password,
        salt,
      );
      admin.salt = salt;
      admin.password = hashedPassword;

      await new this.adminModel(admin).save();

      return { message: 'Password changed' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
