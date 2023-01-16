import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    // @Inject('SECURITY_MS') private readonly securityClient: ClientProxy
  ) {}

  getHello(response: Response)  {
    return "this.securityClient"
    // .send('get_all_sponsors', {})
    // .subscribe((data) =>{
    //   console.log("data")
    //   console.log(data)
    //   response.status(HttpStatus.OK).send(JSON.stringify(data))
    
    // }
    // );
    // return 'Hello World!';
  }
}
