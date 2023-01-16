import { Controller, Get } from '@nestjs/common';
import { LokiLogger } from 'nestjs-loki-logger';
import * as api from '@opentelemetry/api';
import { MessagePattern } from '@nestjs/microservices';

@Controller("hello")
export class AppController {

  constructor() {}

  @MessagePattern({ cmd: 'ramez' })
  microserviceTest(data: string): string {
    return data + ' - first microservice!';
  }

  @Get()
  async getHello(): Promise<string> {
   
    const tracer = api.trace.getTracer('casa-padel-sfax', '1.0.0');

    return await tracer.startActiveSpan('/hello', async (span) => {
      if (span.isRecording()) {
        span.setAttribute('http.method', 'GET')
        span.setAttribute('http.route', '/hello')
      }
      let value
      try {
        value = "hello"
      } catch (exc) {
        span.recordException(exc)
        span.setStatus({ code: api.SpanStatusCode.ERROR, message: String(exc) })
      } finally {
        span.end()
      }
      return value
    })
    
  }
}