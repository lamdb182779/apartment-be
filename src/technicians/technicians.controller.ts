import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Roles } from 'src/helpers/decorators';
import { IdParamDto } from 'src/helpers/utils';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) { }

  @Roles("manager")
  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @Roles("manager")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.techniciansService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @Roles("manager")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.techniciansService.deactive(param.id)
  }

  @Roles("manager")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.techniciansService.reactive(param.id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
