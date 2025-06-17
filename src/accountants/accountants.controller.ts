import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AccountantsService } from './accountants.service';
import { CreateAccountantDto } from './dto/create-accountant.dto';
import { UpdateAccountantDto } from './dto/update-accountant.dto';
import { Roles } from 'src/helpers/decorators';
import { IdParamDto } from 'src/helpers/utils';

@Controller('accountants')
export class AccountantsController {
  constructor(private readonly accountantsService: AccountantsService) { }

  @Roles("manager")
  @Post()
  create(@Body() createAccountantDto: CreateAccountantDto) {
    return this.accountantsService.create(createAccountantDto);
  }

  @Roles("manager")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize, orderBy, ...filter } = query
    return this.accountantsService.findAll(filter, +current, +pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountantsService.findOne(id);
  }

  @Roles("manager")
  @Patch('deactive/:id')
  deactive(@Param() param: IdParamDto) {
    return this.accountantsService.deactive(param.id)
  }

  @Roles("manager")
  @Patch('reactive/:id')
  reactive(@Param() param: IdParamDto) {
    return this.accountantsService.reactive(param.id)
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
