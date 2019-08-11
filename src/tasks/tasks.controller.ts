import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { get } from 'https';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto:GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilter(filterDto);
        }else{
            return this.tasksService.getAllTasks();

        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string){
        let found =  this.tasksService.getTaskById(id);
        if(!found){
            throw new NotFoundException(`Task with id:${id} not found`);
        }
        return found;
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto:CreateTaskDto):Task {
        return this.tasksService.createTask(createTaskDto);
    }
    @Delete('/:id')
    deteteTask(@Param('id') id:string):void{
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id:string, @Body('status') status:TaskStatus):Task{
        return this.tasksService.updateTaskStatus(id,status);
    }
}
