import { Controller, Post, Get, Put, Delete, Body, Param, UsePipes } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
    constructor(private ideaService: IdeaService){}
    @Get()
    showAllIdeas () {
        return this.ideaService.showAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createIdea(@Body() data: IdeaDTO) {
        return this.ideaService.create(data);
    }

    @Get(':id')
    readIdea(@Param('id') id: string) {
        return this.ideaService.read(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.update(id, data)
    }

    @Delete(':id')
    destroyIdea(@Param('id') id: string) {
        return this.ideaService.destroy(id);
    }

}
