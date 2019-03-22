import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';
export class IdeaDTO {
    @IsString()
    idea: string;

    @IsString()
    description: string;
}

export class IdeaRO {
    id?: string;
    updated:string;
    created: string;
    idea: string;
    description: string;
    author: UserRO
}