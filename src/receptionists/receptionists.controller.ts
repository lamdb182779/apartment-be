import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceptionistsService } from './receptionists.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { Roles } from 'src/helpers/decorators';
import { IdParamDto } from 'src/helpers/utils';

@Controller('receptionists')
export class ReceptionistsController {
  constructor(private readonly receptionistsService: ReceptionistsService) { }

  @Roles("manager")
  @Post()
  create(@Body() createReceptionistDto: CreateReceptionistDto) {
    return this.receptionistsService.create(createReceptionistDto);
  }

  @Roles("manager")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.receptionistsService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receptionistsService.findOne(id);
  }

  @Roles("manager")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.receptionistsService.deactive(param.id)
  }

  @Roles("manager")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.receptionistsService.reactive(param.id)
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
