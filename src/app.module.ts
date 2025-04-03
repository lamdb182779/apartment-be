import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AccountantsModule } from './accountants/accountants.module';
import { ParametersModule } from './parameters/parameters.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { BillsModule } from './bills/bills.module';
import { OwnersModule } from './owners/owners.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TechniciansModule } from './technicians/technicians.module';
import { VisitorsModule } from './visitors/visitors.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReceptionistsModule } from './receptionists/receptionists.module';
import { DirectorsModule } from './directors/directors.module';
import { RegentsModule } from './regents/regents.module';
import { RoomsModule } from './rooms/rooms.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PaymentsModule } from './payments/payments.module';

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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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
    AccountantsModule,
    ParametersModule,
    ApartmentsModule,
    BillsModule,
    OwnersModule,
    TenantsModule,
    TechniciansModule,
    VisitorsModule,
    ServicesModule,
    NotificationsModule,
    ReceptionistsModule,
    DirectorsModule,
    RegentsModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>("MAIL_USERNAME"),
            pass: configService.get<string>("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/helpers/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      })
    }),
    RoomsModule,
    VehiclesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
