import { LokiLogger } from 'nestjs-loki-logger';
import * as api from '@opentelemetry/api';
import { AppService } from './app.service';
import { Body, Controller, Get, Inject, Post, Res, Response } from '@nestjs/common';
import { response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller("hello")
export class AppController {

  constructor(
    private  readonly appservice : AppService,

  ) {
  }
  // @Get('/first')
  // testFirstService(): Observable<string> {
  //   return this.firstClient.send<string>(
  //     { cmd: 'ramez' },
  //     'Message from ramos',
  //   );
  // }


  @Get()
  async getHello() {

    return this.appservice.getHello( response )
   
    // const tracer = api.trace.getTracer('casa-padel-sfax', '1.0.0');

    // // return await this.appservice.getHello(@Res() response)

    // return await tracer.startActiveSpan('/hello', async (span) => {
    //   if (span.isRecording()) {
    //     span.setAttribute('http.method', 'GET')
    //     span.setAttribute('http.route', '/hello')
    //   }
    //   let value : any
    //   try {
    //     value = this.appservice.getHello(@Res() response)
    //   } catch (exc) {
    //     span.recordException(exc)
    //     span.setStatus({ code: api.SpanStatusCode.ERROR, message: String(exc) })
    //   } finally {
    //     span.end()
    //   }
    //   return value
    // })
    
  }
}