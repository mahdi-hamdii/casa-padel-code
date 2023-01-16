import { Controller } from '@nestjs/common';
import { TracerService } from './tracer.service';

@Controller('tracing')
export class tracerController {
  constructor(private readonly tracerService: TracerService) {}
}
