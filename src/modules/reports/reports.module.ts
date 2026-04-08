import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { User } from '../users/models/user.model';
import { Lead } from '../leads/models/lead.model';
import { Task } from '../tasks/models/task.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Lead, Task])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
