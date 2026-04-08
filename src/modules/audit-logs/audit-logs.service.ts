import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './models/audit-log.model';
import { User } from '../users/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
  ) {}

  async log(data: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogModel.create(data as any);
  }

  async findAll(
    userId?: string,
    action?: string,
    resource?: string,
    limit: number = 100
  ): Promise<AuditLog[]> {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (resource) {
      where.resource = resource;
    }

    return this.auditLogModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async findByUser(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async findByAction(action: string, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      where: { action },
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }
}
