import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}
    @Query()
    async users() {
        return await this.userService.showAll();
    } 

    @Query()
    async user (@Args('username') username: string) {
        return await this.userService.read(username);
    }

    @Query()
    @UseGuards(new AuthGuard())
    // The user data comes from the user context created in the AuthGuard
    async whoami (@Context('user') user) {
        const { username } = user;
        return await this.userService.read(username);
    }

    @Mutation()
    async login(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDTO = { username, password };
      return await this.userService.login(user);
    }

    @Mutation()
    async register(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDTO = { username, password };
      return await this.userService.register(user);
    }
}