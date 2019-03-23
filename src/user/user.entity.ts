import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { text } from 'body-parser';
import { async } from 'rxjs/internal/scheduler/async';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from 'src/idea/idea.entity';

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

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[]

    @ManyToMany(type => IdeaEntity, { cascade: true })
    @JoinTable()
    bookmarks: IdeaEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // send only the necessary data to the client in the response
    // for example, do not send password
    toResponseObject(showToken: boolean = true) {
        const { id, created, username, token } = this;
        let responseObj:any = { id, created, username };
        if (showToken) {
           responseObj.token = token;
        }
        if (this.ideas) {
            responseObj.ideas = this.ideas;
        }
        if (this.bookmarks) {
            responseObj.bookmarks = this.bookmarks;
        }
        return responseObj;
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