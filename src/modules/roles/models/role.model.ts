import { Column, DataType, Model, Table, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Permission } from '../../permissions/models/permission.model';
import { RolePermission } from './role-permission.model';

@Table({ tableName: 'roles', timestamps: true })
export class Role extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string; // "ADMIN", "MANAGER", "AGENT", "CUSTOMER"

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @HasMany(() => User)
  declare users: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions: Permission[];
}
