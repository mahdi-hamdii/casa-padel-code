import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
    private context ="ramez"
    async getContext() {
       return this.context
      }
      async setContext(context) {
         this.context = context
       }
    
}

