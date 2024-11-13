import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { AccountantsModule } from './accountants/accountants.module';
import { ParametersModule } from './parameters/parameters.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { BillsModule } from './bills/bills.module';
import { OwnersModule } from './owners/owners.module';
import { TentantsModule } from './tentants/tentants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the DataSourceOptions.
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          "dist/**/*.entity.js"
        ],
        synchronize: true,
      }),
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    AccountsModule,
    AccountantsModule,
    ParametersModule,
    ApartmentsModule,
    BillsModule,
    OwnersModule,
    TentantsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
