import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserStatus } from '../users/models/user.model';
import { Lead, LeadStatus } from '../leads/models/lead.model';
import { Task, TaskStatus } from '../tasks/models/task.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Lead) private leadModel: typeof Lead,
    @InjectModel(Task) private taskModel: typeof Task,
  ) {}

  async getOverview() {
    const [totalUsers, totalLeads, totalTasks] = await Promise.all([
      this.userModel.count(),
      this.leadModel.count(),
      this.taskModel.count(),
    ]);

    return {
      totalUsers,
      totalLeads,
      totalTasks,
    };
  }

  async getUserStats() {
    const total = await this.userModel.count();
    const active = await this.userModel.count({ where: { status: UserStatus.ACTIVE } });
    const suspended = await this.userModel.count({ where: { status: UserStatus.SUSPENDED } });
    const banned = await this.userModel.count({ where: { status: UserStatus.BANNED } });

    return { total, active, suspended, banned };
  }

  async getLeadStats() {
    const total = await this.leadModel.count();
    const byStatus = await Promise.all(
      Object.values(LeadStatus).map(async (status) => ({
        status,
        count: await this.leadModel.count({ where: { status } }),
      }))
    );

    return { total, byStatus };
  }

  async getTaskStats() {
    const total = await this.taskModel.count();
    const byStatus = await Promise.all(
      Object.values(TaskStatus).map(async (status) => ({
        status,
        count: await this.taskModel.count({ where: { status } }),
      }))
    );

    return { total, byStatus };
  }
}
