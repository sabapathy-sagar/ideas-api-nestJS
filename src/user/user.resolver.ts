import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}
    @Query()
    users() {
        return this.userService.showAll();
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