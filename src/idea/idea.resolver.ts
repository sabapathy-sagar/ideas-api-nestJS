import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";
import { IdeaDTO } from "./idea.dto";
import { Identifier } from "ts-morph";

@Resolver()
export class IdeaResolver {
    constructor(private ideaService: IdeaService) {}

    @Query()
    async ideas () {
        return await this.ideaService.showAll();
    }

    /**
     * 
     * @param id 
     */
    @Query()
    async idea (@Args('id') id: string) {
        return await this.ideaService.read(id);
    }

    /**
     * 
     * @param idea 
     * @param description 
     * @param user 
     */
    @Mutation()
    @UseGuards(new AuthGuard())
    async createIdea (@Args('idea') idea: string, @Args('description') description: string,
        @Context('user') user) {
            const data: IdeaDTO = { idea, description };
            const { id: userId } = user;
            return await this.ideaService.create(userId, data);
    }

    /**
     * 
     * @param id 
     * @param idea 
     * @param description 
     * @param user 
     */
    @Mutation()
    @UseGuards(new AuthGuard())
    async updateIdea (@Args('id') id: string, @Args('idea') idea: string, @Args('description') description: string,
        @Context('user') user) {
            const data: IdeaDTO = { idea, description };
            const { id: userId } = user;
            return await this.ideaService.update(id, userId, data);
    }

    /**
     * 
     * @param id 
     * @param user 
     */
    @Mutation()
    @UseGuards(new AuthGuard())
    async deleteIdea (@Args('id') id: string, @Context('user') user) {
            const { id: userId } = user;
            return await this.ideaService.destroy(id, userId);
    }

    /**
     * 
     * @param id 
     * @param user 
     */
    @Mutation()
    @UseGuards(new AuthGuard())
    async bookmark (@Args('id') id: string, @Context('user') user) {
            const { id: userId } = user;
            return await this.ideaService.bookmark(id, userId);
    }

    /**
     * 
     * @param id 
     * @param user 
     */
    @Mutation()
    @UseGuards(new AuthGuard())
    async unbookmark (@Args('id') id: string, @Context('user') user) {
            const { id: userId } = user;
            return await this.ideaService.unbookmark(id, userId);
    }
}