import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Roles } from 'src/helpers/decorators';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Roles("owner", "resident")
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.servicesService.findAll(+current, +pageSize);
  }

  @Roles("owner", "resident")
  @Get("self")
  findAllByApartment(@Request() req, @Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.servicesService.findAllBySelf(req.user, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch('status')
  status(@Body() body) {
    return this.servicesService.status(body.id, body.status, body.reason);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
