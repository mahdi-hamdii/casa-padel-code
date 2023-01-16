import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async validateRequest(email: string): Promise<boolean> {
    // Validate if the user is super admin
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin || admin.role != 'sa') {
      console.log("Unauthorized")

      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // remove the barrer and keep only the token
    let jwt;
    try {
      jwt = request.headers.authorization.slice(7);
      await this.jwtService.verify(jwt);
    } catch (error) {
      console.log("Unauthorized")

      throw new UnauthorizedException('Invalid Token');
    }

    const payload = await this.jwtService.decode(jwt);
    const email = payload['email'];

    return this.validateRequest(email);
  }
}
