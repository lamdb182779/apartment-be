import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Public, Roles } from 'src/helpers/decorators';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Roles("manager", "accountant")
  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Roles("manager", "accountant")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { month, current, pageSize } = query
    return this.billsService.findAll(month, +current, +pageSize);
  }

  @Get('self')
  findSelfAll(@Request() req) {
    return this.billsService.findSelfAll(req.user.id, req.user.role)
  }

  @Get('owner/:id')
  findByOwner(@Param('id') id: string) {
    return this.billsService.findByOwner(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(id);
  }

  @Roles("manager", "accountant")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(id, updateBillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billsService.remove(id);
  }
}
