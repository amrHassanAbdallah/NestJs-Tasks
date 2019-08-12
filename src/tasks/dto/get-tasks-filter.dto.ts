import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { Task } from "../task.entity";

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn(Task.getTaskStatus())
    status: string;
    @IsOptional()
    @IsNotEmpty()
    search: string;
}