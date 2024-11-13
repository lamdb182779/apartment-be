import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TentantsService } from './tentants.service';
import { CreateTentantDto } from './dto/create-tentant.dto';
import { UpdateTentantDto } from './dto/update-tentant.dto';

@Controller('tentants')
export class TentantsController {
  constructor(private readonly tentantsService: TentantsService) {}

  @Post()
  create(@Body() createTentantDto: CreateTentantDto) {
    return this.tentantsService.create(createTentantDto);
  }

  @Get()
  findAll() {
    return this.tentantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tentantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTentantDto: UpdateTentantDto) {
    return this.tentantsService.update(+id, updateTentantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tentantsService.remove(+id);
  }
}
