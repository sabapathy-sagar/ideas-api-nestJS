import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
    @Query()
    users() {
        return [{ id: 'id', username: 'username'}]
    } 
}