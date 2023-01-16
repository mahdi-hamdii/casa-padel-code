import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async validateRequest(email: string): Promise<boolean> {
    // Validate if the user is an admin
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin || (admin.role != 'a' && admin.role != 'sa')) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      // remove the barrer and keep only the token
      const jwt = request.headers.authorization.slice(7);
      await this.jwtService.verify(jwt);
      const payload = await this.jwtService.decode(jwt);
      const email = payload['email'];
      return this.validateRequest(email);
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
