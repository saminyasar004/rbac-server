import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Permission } from '../../permissions/models/permission.model';

@Table({ tableName: 'user_permissions', timestamps: false })
export class UserPermission extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.UUID, allowNull: false })
  declare permissionId: string;
}
