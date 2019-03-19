import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from 'typeorm';
import { text } from 'body-parser';
import { async } from 'rxjs/internal/scheduler/async';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'text',
        unique: true
    })
    username: string;

    @Column('text')
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // send only the necessary data to the client in the response
    // for example, do not send password
    toResponseObject(showToken: boolean = false) {
        const { id, created, username, token } = this;
        let responseObj = { id, created, username, token };
        if (showToken) {
           return  responseObj;
        }
        return { id, created, username };
    }

    // check if the entered password is same as the stored password
    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token() {
        const { id, username } = this;

        return jwt.sign({
            id, username
        }, process.env.SECRET, { expiresIn: '7d'});
    }

}