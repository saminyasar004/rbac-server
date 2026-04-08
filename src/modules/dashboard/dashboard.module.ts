import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/models/user.model';
import { Lead } from '../leads/models/lead.model';
import { Task } from '../tasks/models/task.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Lead, Task])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
