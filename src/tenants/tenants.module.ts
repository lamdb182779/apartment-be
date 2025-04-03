import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Apartment])],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule { }
