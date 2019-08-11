export class Task{
    id:string;
    title:string;
    description:string;
    status:TaskStatus;

    static getTaskStatus():String[]{
        return Object.values(TaskStatus)
    }
}


export enum TaskStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}