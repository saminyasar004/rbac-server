import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Role } from './role.model';
import { Permission } from '../../permissions/models/permission.model';

@Table({ tableName: 'role_permissions', timestamps: false })
export class RolePermission extends Model {
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare roleId: string;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.UUID, allowNull: false })
  declare permissionId: string;
}
