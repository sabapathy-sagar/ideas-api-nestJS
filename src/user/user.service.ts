import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {}

    async showAll(): Promise<UserRO[]> {
        const users = await this.userRepository.find({ relations: ['ideas', 'bookmarks']});
        return users.map(user => user.toResponseObject(false));
    }

    async read (username: string) {
        const user = await this.userRepository.findOne({ where: { username }, relations: ['ideas', 'bookmarks']});
        return user.toResponseObject(false);
    }

    async login (data: UserDTO) {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username }});
        // check if the user exists or the entered password matches the stored password.
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(true);
    }
    async register (data: UserDTO) {
        const { username } = data;
        let user = await this.userRepository.findOne({ where: { username }});

        // if user already exists then throw error
        if (user) {
            throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
        }

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject(true);
    }
}
