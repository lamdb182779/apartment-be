import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { query } from 'express';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) { }

  @Post()
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.apartmentsService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get('allnumber')
  findAllNumber() {
    return this.apartmentsService.findAllNumber();
  }

  @Get('ownerless')
  findOwnerless() {
    return this.apartmentsService.findOwnerless()
  }

  @Get('ownered')
  findOwnered(@Query("floor") floor?: string) {
    return this.apartmentsService.findOwnered(+floor)
  }

  @Get('check-owner')
  checkOwnered(@Query("number") number: string) {
    return this.apartmentsService.checkOwnered(+number)
  }

  @Get('tenant-looking')
  tenantLooking() {
    return this.apartmentsService.tenantLooking()
  }

  @Get('nearest')
  findNearest(@Query() query: Record<string, string>) {
    const { number, time } = query
    return this.apartmentsService.findNearest(+number, time)
  }

  @Get(':number')
  findOne(@Param('number') number: string) {
    return this.apartmentsService.findOne(+number);
  }

  @Patch('change-tenant-looking/:number')
  changeTenantLooking(@Param('number') number: string) {
    return this.apartmentsService.changeTenantLooking(+number)
  }

  @Patch('rental-info/:number')
  rentalInfo(@Param('number') number: string, @Body() updateRentalInfo) {
    return this.apartmentsService.rentalInfo(+number, updateRentalInfo)
  }

  @Patch(':number')
  update(@Param('number') number: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(+number, updateApartmentDto);
  }

  @Delete(':number')
  remove(@Param('number') number: string) {
    return this.apartmentsService.remove(+number);
  }
}
