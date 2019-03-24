import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();

    // REST
    if (request) {
      if (!request.headers.authorization) {
        return Promise.resolve(false);
    }
     request.user = await this.validateToken(request.headers.authorization);
     return request.user ?  Promise.resolve(true) : Promise.reject(false);
    } 
    // GraphQL
    else {
      const ctx: any = GqlExecutionContext.create(context);

      if (!ctx.headers.authorization) {
        return Promise.resolve(false);
      }

      ctx.user = await this.validateToken(ctx.headers.authorization);
      return ctx.user ?  Promise.resolve(true) : Promise.reject(false);
    }

  }

  async validateToken(auth: string) {
      const [authPrefix, authToken] = auth.split(' ');
      
      if (authPrefix !== 'Bearer') {
        throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
      }

      try {
        const decoded = await jwt.verify(authToken, process.env.SECRET);
        return decoded;
      } catch (err) {
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }


  }
}

