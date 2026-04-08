import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { Permission } from '../permissions/models/permission.model';
import { RolePermission } from './models/role-permission.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(RolePermission)
    private rolePermissionModel: typeof RolePermission,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll({ 
      include: [{ model: Permission, attributes: ['id', 'name', 'description'] }],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Role | null> {
    return this.roleModel.findByPk(id, { 
      include: [{ model: Permission, attributes: ['id', 'name', 'description'] }] 
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ 
      where: { name },
      include: [{ model: Permission, attributes: ['id', 'name', 'description'] }] 
    });
  }

  async create(roleData: Partial<Role>): Promise<Role> {
    const existing = await this.roleModel.findOne({ where: { name: roleData.name } });
    if (existing) {
      throw new BadRequestException('Role with this name already exists');
    }
    return this.roleModel.create(roleData as any);
  }

  async update(id: string, roleData: Partial<Role>): Promise<Role> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (roleData.name && roleData.name !== role.name) {
      const existing = await this.roleModel.findOne({ where: { name: roleData.name } });
      if (existing) {
        throw new BadRequestException('Role with this name already exists');
      }
    }

    await role.update(roleData);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException('Role not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    await role.destroy();
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    const existing = await this.rolePermissionModel.findOne({
      where: { roleId, permissionId },
    });

    if (existing) {
      throw new BadRequestException('Permission already assigned to this role');
    }

    await this.rolePermissionModel.create({ roleId, permissionId } as any);
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    const result = await this.rolePermissionModel.destroy({ 
      where: { roleId, permissionId } 
    });

    if (result === 0) {
      throw new NotFoundException('Permission not found for this role');
    }
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role.permissions || [];
  }
}
