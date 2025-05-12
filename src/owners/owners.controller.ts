import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { IdParamDto } from 'src/helpers/utils';
import { Roles } from 'src/helpers/decorators';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) { }

  @Roles("manager", "receptionist")
  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Roles("manager", "receptionist", "technician")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, active, ...filter } = query
    return this.ownersService.findAll(filter, +current, +pageSize, orderBy, active);
  }

  @Roles("owner")
  @Get('apartments')
  findSelfApartment(@Request() req) {
    return this.ownersService.findSelfApartment(req.user.id);
  }

  @Roles("owner")
  @Get('account')
  findSelfAccount() {
    return this.ownersService.findSelfAccount();
  }

  @Roles("manager", "receptionist")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.ownersService.deactive(param.id)
  }

  @Roles("manager", "receptionist")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.ownersService.reactive(param.id)
  }

  @Roles("manager", "receptionist")
  @Patch(':id')
  update(@Param() param: IdParamDto, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(param.id, updateOwnerDto);
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.ownersService.remove(param.id);
  }

  @Get(':id')
  findOne(@Param() param: IdParamDto) {
    return this.ownersService.findOne(param.id);
  }
}
