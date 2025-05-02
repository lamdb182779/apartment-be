import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { IdParamDto } from 'src/helpers/utils';
import { Roles } from 'src/helpers/decorators';

@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) { }


  @Roles("manager", "receptionist", "technician", "accountant")
  @Post()
  create(@Body() createSampleDto: CreateSampleDto) {
    return this.samplesService.create(createSampleDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.samplesService.findAll(+current, +pageSize);
  }

  @Get('/all')
  find() {
    return this.samplesService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.samplesService.findOne(+id);
  }

  @Roles("manager", "receptionist", "technician", "accountant")
  @Patch(':id')
  update(@Param() param: IdParamDto, @Body() updateSampleDto: UpdateSampleDto) {
    return this.samplesService.update(param.id, updateSampleDto);
  }

  @Roles("manager", "receptionist", "technician", "accountant")
  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.samplesService.remove(param.id);
  }
}
