import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { IdParamDto } from 'src/helpers/utils';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) { }

  @Post()
  create() {
    return this.parametersService.create();
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { month, floor } = query
    return this.parametersService.findAll(month, +floor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parametersService.findOne(id);
  }

  @Patch(':id')
  update(@Param() param: IdParamDto, @Body() updateParameterDto: UpdateParameterDto) {
    return this.parametersService.update(param.id, updateParameterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametersService.remove(id);
  }
}
