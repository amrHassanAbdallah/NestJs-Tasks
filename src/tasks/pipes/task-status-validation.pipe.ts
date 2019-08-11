import { PipeTransform, BadRequestException } from "@nestjs/common";
import { Task } from "../task.model";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = Task.getTaskStatus();
    transform(value:any){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is invalid status.`);
        }
        return value;
    }

    private isStatusValid(status:any){
        return this.allowedStatus.indexOf(status) >= 0;
    }
}