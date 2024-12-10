import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegentsService } from './regents.service';
import { CreateRegentDto } from './dto/create-regent.dto';
import { UpdateRegentDto } from './dto/update-regent.dto';

@Controller('regents')
export class RegentsController {
  constructor(private readonly regentsService: RegentsService) { }

  @Post()
  create(@Body() createRegentDto: CreateRegentDto) {
    return this.regentsService.create(createRegentDto);
  }

  @Get()
  findAll() {
    return this.regentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegentDto: UpdateRegentDto) {
    return this.regentsService.update(id, updateRegentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regentsService.remove(id);
  }
}
