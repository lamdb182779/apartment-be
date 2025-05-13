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
import { ResidentsModule } from './residents/residents.module';
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
import { ManagersModule } from './managers/managers.module';
import { RoomsModule } from './rooms/rooms.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PaymentsModule } from './payments/payments.module';
import { SamplesModule } from './samples/samples.module';
import { CommentsModule } from './comments/comments.module';
import { Owner } from './owners/entities/owner.entity';
import { Resident } from './residents/entities/resident.entity';
import { Accountant } from './accountants/entities/accountant.entity';
import { Receptionist } from './receptionists/entities/receptionist.entity';
import { Technician } from './technicians/entities/technician.entity';
import { Manager } from './managers/entities/manager.entity';
import { RepliesModule } from './replies/replies.module';
import { TasksModule } from './tasks/tasks.module';

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
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DB_URL')
        return ({
          type: 'postgres',
          // host: configService.get<string>('DB_HOST'),
          // port: configService.get<number>('DB_PORT'),
          // username: configService.get<string>('DB_USERNAME'),
          // password: configService.get<string>('DB_PASSWORD'),
          // database: configService.get<string>('DB_DATABASE'),
          url,
          entities: [
            "dist/**/*.entity.js"
          ],
          synchronize: true,
        })
      },
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    TypeOrmModule.forFeature([Owner, Resident, Accountant, Receptionist, Technician, Manager]),
    AccountantsModule,
    ParametersModule,
    ApartmentsModule,
    BillsModule,
    OwnersModule,
    ResidentsModule,
    TechniciansModule,
    VisitorsModule,
    ServicesModule,
    NotificationsModule,
    ReceptionistsModule,
    ManagersModule,
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
    SamplesModule,
    CommentsModule,
    RepliesModule,
    TasksModule,
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
