import { Controller, Post, Get, Put, Delete, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/idea')
export class IdeaController {
    constructor(private ideaService: IdeaService){}
    @Get()
    showAllIdeas () {
        return this.ideaService.showAll();
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User('id') user, @Body() data: IdeaDTO) {
        return this.ideaService.create(user, data);
    }

    @Get(':id')
    readIdea(@Param('id') id: string) {
        return this.ideaService.read(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @User('id') user: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.update(id, user, data)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyIdea(@Param('id') id: string, @User('id') user: string) {
        return this.ideaService.destroy(id, user);
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id: string, @User('id') user: string) {
        return this.ideaService.bookmark(id, user);
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id: string, @User('id') user: string) {
        return this.ideaService.unbookmark(id, user);
    }

}
