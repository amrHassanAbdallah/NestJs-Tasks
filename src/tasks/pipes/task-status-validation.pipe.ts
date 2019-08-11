import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [TaskStatus.OPEN,TaskStatus.DONE,TaskStatus.IN_PROGRESS];
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