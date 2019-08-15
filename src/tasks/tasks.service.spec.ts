import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

const mockUser = { id: 1, username: 'test' };
const mockTeskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTeskRepository }
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });


    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue([]);
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: '', search: '' };
            let result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result.length).toEqual(0);

        });

        describe('get task by id', () => {
            it('should return the task successfully', async () => {
                const mockTask = { title: "Test Task", description: "test desc" };
                taskRepository.findOne.mockResolvedValue(mockTask);

                const result = await tasksService.getTaskById(1, mockUser);
                expect(result).toEqual(mockTask);

                expect(taskRepository.findOne).toHaveBeenCalledWith({
                    where: {
                        id: 1,
                        userId: mockUser.id,
                    }
                })
            });

            it('throws an error, task not found', () => {
                taskRepository.findOne.mockResolvedValue(null);
                expect(tasksService.getTaskById(1, mockUser)).rejects.toThrowError(NotFoundException);
            });

        });
    });

    describe('create task', () => {
        it('create a new task', async () => {
            const mockTask = { title: "Test Task", description: "test desc" };
            taskRepository.createTask.mockResolvedValue(mockTask);

            const data: CreateTaskDto = mockTask;
            let result = await tasksService.createTask(data, mockUser);
            expect(result).toEqual(mockTask);

        });

    });

    describe('delete task', () => {
        it('delete task successfully', async () => {
            const mockResult = { affected: 1 };
            taskRepository.delete.mockResolvedValue(mockResult);

            let result = await tasksService.deleteTask(1, mockUser);
            expect(result).toEqual(undefined);

        });

        it('fall if the task not found', () => {
            const mockResult = {};
            taskRepository.delete.mockResolvedValue(mockResult);


            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrowError(NotFoundException);
        });

    });


    describe('update task status', () => {
        it('update task status successfully', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);

        });
    });




});
