import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceptionistsService } from './receptionists.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';

@Controller('receptionists')
export class ReceptionistsController {
  constructor(private readonly receptionistsService: ReceptionistsService) { }

  @Post()
  create(@Body() createReceptionistDto: CreateReceptionistDto) {
    return this.receptionistsService.create(createReceptionistDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.receptionistsService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receptionistsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceptionistDto: UpdateReceptionistDto) {
    return this.receptionistsService.update(id, updateReceptionistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receptionistsService.remove(id);
  }
}
