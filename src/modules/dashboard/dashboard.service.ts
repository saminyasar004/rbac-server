import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { Lead } from '../leads/models/lead.model';
import { Task } from '../tasks/models/task.model';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Lead) private leadModel: typeof Lead,
    @InjectModel(Task) private taskModel: typeof Task,
  ) {}

  async getDashboardData(userId: string) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const myLeads = await this.leadModel.count({ where: { assignedTo: userId } });
    const myTasks = await this.taskModel.count({ where: { assignedTo: userId } });

    const dashboardData: any = {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role?.name,
      },
      myLeads,
      myTasks,
    };

    return dashboardData;
  }
}
