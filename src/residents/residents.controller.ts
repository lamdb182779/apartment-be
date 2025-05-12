import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { IdParamDto } from 'src/helpers/utils';
import { Roles } from 'src/helpers/decorators';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) { }

  @Roles("manager", "receptionist")
  @Post()
  create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentsService.create(createResidentDto);
  }

  @Roles("manager", "receptionist")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, active, ...filter } = query
    return this.residentsService.findAll(filter, +current, +pageSize, orderBy, active);
  }

  @Roles("resident")
  @Get("apartment")
  findSelfApartment(@Request() req) {
    return this.residentsService.findSelfApartment(req.user.id);
  }

  @Roles("resident")
  @Get("apartment-info")
  findApartmentInfo(@Request() req) {
    return this.residentsService.findApartmentInfo(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Roles("manager", "receptionist")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.residentsService.deactive(param.id)
  }

  @Roles("manager", "receptionist")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.residentsService.reactive(param.id)
  }

  @Patch(':id')
  update(@Param() param: IdParamDto, @Body() updateResidentDto: UpdateResidentDto) {
    return this.residentsService.update(param.id, updateResidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}
