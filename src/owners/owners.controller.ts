import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { IdParamDto } from 'src/helpers/utils';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) { }

  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.ownersService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get('apartments')
  findSelfApartment(@Request() req) {
    return this.ownersService.findSelfApartment(req.user.id);
  }

  @Get('account')
  findSelfAccount() {
    return this.ownersService.findSelfAccount();
  }

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
