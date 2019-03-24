import { Injectable, NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        call$: CallHandler
    ) : Observable<any> {
        const req = context.switchToHttp().getRequest();

        // since req(request) is a REST specific entity, it breaks the graphql implementation
        // therefore check if req exists, if yes then its part of the REST call.
        if (req) {
            const method = req.method;
            const url = req.url;
            const now = Date.now();
    
            return call$
                .handle()
                .pipe(
                tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ns`, 
                context.getClass().name))
            );
        } else {
            return call$.handle();
        }

    }
}