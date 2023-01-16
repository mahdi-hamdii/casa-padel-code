import { Global, Module } from '@nestjs/common';
import { TracerService } from './tracer.service';
import { tracerController } from './tracer.controller';

@Global()
@Module({
  imports: [],
  controllers: [tracerController ],
  providers: [TracerService],
 
  
})
export class TracerModule {}
