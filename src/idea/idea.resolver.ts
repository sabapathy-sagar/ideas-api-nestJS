import { Resolver, Query } from "@nestjs/graphql";
import { IdeaService } from "./idea.service";

@Resolver()
export class IdeaResolver {
    constructor(private ideaService: IdeaService) {}

    @Query()
    async ideas () {
        return await this.ideaService.showAll();
    }
}