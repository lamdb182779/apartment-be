import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.tasksService.findAll(+current, +pageSize);
  }

  @Get("self")
  findAllBySelf(@Query() query: Record<string, string>, @Request() req) {
    const { current, pageSize } = query
    return this.tasksService.findAllBySelf(+current, +pageSize, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch('complete/:id')
  complete(@Param('id') id: string, @Body("complete") complete: boolean) {
    return this.tasksService.complete(id, complete);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
