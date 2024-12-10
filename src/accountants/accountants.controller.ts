import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AccountantsService } from './accountants.service';
import { CreateAccountantDto } from './dto/create-accountant.dto';
import { UpdateAccountantDto } from './dto/update-accountant.dto';

@Controller('accountants')
export class AccountantsController {
  constructor(private readonly accountantsService: AccountantsService) { }

  @Post()
  create(@Body() createAccountantDto: CreateAccountantDto) {
    return this.accountantsService.create(createAccountantDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.accountantsService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountantDto: UpdateAccountantDto) {
    return this.accountantsService.update(id, updateAccountantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountantsService.remove(id);
  }
}
