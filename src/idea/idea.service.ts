import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
import { Repository } from 'typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}

    private toResponseObj (idea: IdeaEntity): IdeaRO {
        const responseObj: any = { ...idea, author: idea.author.toResponseObject(false)};

        if (responseObj.upvotes) {
            responseObj.upvotes = idea.upvotes.length;
        } 
        if (responseObj.downvotes) {
            responseObj.downvotes = idea.downvotes.length;
        } 

        return responseObj;
    }

    private ensureOwnerShip (idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
        }
    }

    async showAll (): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find({ relations: ['author', 'upvotes', 'downvotes']});
        return ideas.map(idea => this.toResponseObj(idea));
    }

    async create (userId: string, data: IdeaDTO): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        const idea = await this.ideaRepository.create({...data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObj(idea);
    }

    async read (id: string): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author']});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObj(idea);
    }

    // using Partial on IdeaDTO as the user may update 
    // either the idea or description or both.
    async update (id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
        let idea = await this.ideaRepository.findOne({ where: {id}, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnerShip(idea, userId);

        await this.ideaRepository.update({ id }, data);
        //return updated idea
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });

        return this.toResponseObj(idea);
    }

    async destroy (id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnerShip(idea, userId);
        await this.ideaRepository.delete({ id });
        return idea;
    }

    /**
     * 
     * @param id Id of the idea
     * @param userId 
     */
    async bookmark (id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: {id}});
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks']});

        const bookmarkedIdeas = user.bookmarks.filter(bookmark => bookmark.id === idea.id);
        /**
         * check if idea is already bookmarked, if not then add bookmark
         */
        if (bookmarkedIdeas.length === 0) {
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();
    }
    /**
     * 
     * @param id Id of the idea
     * @param userId 
     */
    async unbookmark (id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }});
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks']});

        const bookmarkedIdeas = user.bookmarks.filter(bookmark => bookmark.id === idea.id);

        // if bookmarked ideas exist then remove that book mark
        if (bookmarkedIdeas.length !== 0) {
            const otherBookmarkedIdeas  = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
            user.bookmarks = otherBookmarkedIdeas;
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();
    }
}
