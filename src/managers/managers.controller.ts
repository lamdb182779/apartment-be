import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Roles } from 'src/helpers/decorators';
import { IdParamDto } from 'src/helpers/utils';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) { }

  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, active, ...filter } = query
    return this.managersService.findAll(filter, +current, +pageSize, orderBy, active);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(id);
  }

  @Roles("manager")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.managersService.deactive(param.id)
  }

  @Roles("manager")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.managersService.reactive(param.id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managersService.remove(id);
  }
}
