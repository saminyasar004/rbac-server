import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from './models/audit-log.model';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  providers: [AuditLogsService, AuditLogInterceptor],
  controllers: [AuditLogsController],
  exports: [AuditLogsService, AuditLogInterceptor],
})
export class AuditLogsModule {}
