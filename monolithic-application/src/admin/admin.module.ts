import { MonitoringModule } from './../monitoring/monitoring.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';
import { AdminLoggerMiddleware } from './utils/AdminLoggerMiddleware';
import { TracerModule } from 'src/tracer/tracer.module';
import { TracerService } from 'src/tracer/tracer.service';
import sdk from '../tracer/tracer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),MonitoringModule, TracerModule
  ],
  controllers: [AdminController],
  providers: [AdminService, TracerService],
  exports: [MongooseModule, AdminService],
})
export class AdminModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminLoggerMiddleware).forRoutes('admin/*');
  }
}