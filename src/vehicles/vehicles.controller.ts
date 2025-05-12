import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Roles } from 'src/helpers/decorators';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Roles("manager", "technician")
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Roles("manager", "technician")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.vehiclesService.findAll(+current, +pageSize);
  }

  @Roles("manager", "technician")
  @Get("owner")
  findAllByUser(@Body("ownerId") ownerId: string, @Body("roleId") roleId: number) {
    return this.vehiclesService.findAllByUser(ownerId, roleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Roles("manager", "technician")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
