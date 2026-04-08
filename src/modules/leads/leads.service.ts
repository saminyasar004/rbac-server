import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lead, LeadStatus } from './models/lead.model';
import { User } from '../users/models/user.model';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead)
    private leadModel: typeof Lead,
  ) {}

  async create(leadData: Partial<Lead>): Promise<Lead> {
    return this.leadModel.create(leadData as any);
  }

  async findAll(assignedTo?: string): Promise<Lead[]> {
    const where: any = {};
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    return this.leadModel.findAll({
      where,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.leadModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, updateData: Partial<Lead>): Promise<Lead> {
    const lead = await this.findById(id);
    await lead.update(updateData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.findById(id);
    await lead.update({ status });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const lead = await this.findById(id);
    await lead.destroy();
  }

  async assignLead(id: string, userId: string): Promise<Lead> {
    const lead = await this.findById(id);
    await lead.update({ assignedTo: userId });
    return this.findById(id);
  }
}
