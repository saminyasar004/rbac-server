import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskStatus } from './models/task.model';
import { User } from '../users/models/user.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    return this.taskModel.create(taskData as any);
  }

  async findAll(assignedTo?: string): Promise<Task[]> {
    const where: any = {};
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    return this.taskModel.findAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task> {
    const task = await this.findById(id);
    await task.update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const task = await this.findById(id);
    await task.destroy();
  }
}
