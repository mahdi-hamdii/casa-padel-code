import { Injectable } from '@nestjs/common';
import * as api from '@opentelemetry/api';

@Injectable()
export class TracerService {

  private tracer

  constructor(
  ) {
    this.tracer = api.trace.getTracer('casa-padel-sfax', '1.0.0');
  }

 
  async tracingFunction( api_function: Function, route: string,  method: string) : Promise<any> {
    return await this.tracer.startActiveSpan(route, async (span) => {
      if (span.isRecording()) {
        span.setAttribute('http.method', method)
        span.setAttribute('http.route', route)
      }
      let response
      try {
        response =  api_function();
      } catch (exc) {
        span.recordException(exc)
        span.setStatus({ code: api.SpanStatusCode.ERROR, message: String(exc) })
      } finally {
        span.end()
      }
      return await response
      
    })
  }
}
