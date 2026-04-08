import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { LeadsModule } from './modules/leads/leads.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: process.env.DB_CONNECTION_STRING,
      autoLoadModels: true,
      synchronize: true, // For development - will create/update tables
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
      },
      logging: false, // Set to console.log to see SQL queries
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuditLogsModule,
    LeadsModule,
    TasksModule,
    ReportsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
