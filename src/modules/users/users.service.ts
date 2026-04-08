import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserStatus } from './models/user.model';
import { Role } from '../roles/models/role.model';
import { Permission } from '../permissions/models/permission.model';
import { UserPermission } from './models/user-permission.model';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserPermission)
    private userPermissionModel: typeof UserPermission,
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [
        {
          model: Role,
          include: [{ model: Permission, as: 'permissions' }],
        },
        {
          model: Permission,
          as: 'extraPermissions',
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, {
      include: [
        {
          model: Role,
          include: [{ model: Permission, as: 'permissions' }],
        },
        {
          model: Permission,
          as: 'extraPermissions',
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async findAll(managerId?: string): Promise<User[]> {
    const where: any = {};
    if (managerId) {
      where.managerId = managerId;
    }

    return this.userModel.findAll({
      where,
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('User not found after update');
    }
    return updated;
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({ status });
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('User not found after status update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    await user.destroy();
  }

  async getManagedUsers(managerId: string): Promise<User[]> {
    return this.userModel.findAll({
      where: { managerId },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description'],
        },
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async grantPermission(userId: string, permissionId: string, grantorId: string): Promise<void> {
    // Grant Ceiling Check
    const permission = await this.permissionModel.findByPk(permissionId);
    if (!permission) {
      throw new NotFoundException('Permission template not found');
    }

    const grantor = await this.findById(grantorId);
    const grantorPermissions = await this.getUserPermissions(grantorId);
    const isAdmin = grantor?.role?.name === 'ADMIN';

    if (!isAdmin && !grantorPermissions.includes(permission.name)) {
      throw new ForbiddenException(`Grant Ceiling: You cannot grant the permission "${permission.name}" because you do not possess it.`);
    }

    const userPermissions = await this.getUserPermissions(userId);
    if (userPermissions.includes(permission.name)) {
      throw new BadRequestException('Permission already granted to this user (either via role or specifically)');
    }

    await this.userPermissionModel.create({
      userId,
      permissionId,
    } as any);
  }

  async revokePermission(userId: string, permissionId: string): Promise<void> {
    const result = await this.userPermissionModel.destroy({
      where: { userId, permissionId },
    });

    if (result === 0) {
      throw new NotFoundException('Permission not found for this user');
    }
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const rolePermissions = user.role?.permissions?.map(p => p.name) || [];
    const extraPermissions = user.extraPermissions?.map(p => p.name) || [];
    
    // Combine and remove duplicates
    return [...new Set([...rolePermissions, ...extraPermissions])];
  }

  async canUserAccessResource(userId: string, requiredPermission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(requiredPermission);
  }
}
