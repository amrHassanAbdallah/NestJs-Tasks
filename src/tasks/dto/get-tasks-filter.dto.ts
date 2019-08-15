import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { Task } from "../task.entity";
import { ApiModelProperty } from '@nestjs/swagger';

export class GetTasksFilterDto {
    @ApiModelProperty()
    @IsOptional()
    @IsIn(Task.getTaskStatus())
    status: string;
    @ApiModelProperty()
    @IsOptional()
    @IsNotEmpty()
    search: string;
}