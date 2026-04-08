import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './models/permission.model';
import { UserPermission } from '../users/models/user-permission.model';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
    @InjectModel(UserPermission)
    private userPermissionModel: typeof UserPermission,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Permission | null> {
    return this.permissionModel.findByPk(id);
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionModel.findOne({ where: { name } });
  }

  async create(data: Partial<Permission>): Promise<Permission> {
    const existing = await this.permissionModel.findOne({ where: { name: data.name } });
    if (existing) {
      throw new BadRequestException('Permission with this name already exists');
    }
    return this.permissionModel.create(data as any);
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    const permission = await this.findOne(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (data.name && data.name !== permission.name) {
      const existing = await this.permissionModel.findOne({ where: { name: data.name } });
      if (existing) {
        throw new BadRequestException('Permission with this name already exists');
      }
    }

    await permission.update(data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException('Permission not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const permission = await this.findOne(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    await permission.destroy();
  }

  async grantToUser(userId: string, permissionId: string): Promise<void> {
    const existing = await this.userPermissionModel.findOne({
      where: { userId, permissionId },
    });

    if (existing) {
      throw new BadRequestException('Permission already granted to user');
    }

    await this.userPermissionModel.create({ userId, permissionId } as any);
  }

  async revokeFromUser(userId: string, permissionId: string): Promise<void> {
    const result = await this.userPermissionModel.destroy({ 
      where: { userId, permissionId } 
    });

    if (result === 0) {
      throw new NotFoundException('Permission not found for this user');
    }
  }
}
