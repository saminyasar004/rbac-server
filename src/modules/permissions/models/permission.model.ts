import { Column, DataType, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { Role } from '../../roles/models/role.model';
import { RolePermission } from '../../roles/models/role-permission.model';
import { User } from '../../users/models/user.model';
import { UserPermission } from '../../users/models/user-permission.model';

@Table({ tableName: 'permissions', timestamps: true })
export class Permission extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string; // e.g. "users.view", "leads.manage"

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @BelongsToMany(() => Role, () => RolePermission)
  declare roles: Role[];

  @BelongsToMany(() => User, () => UserPermission)
  declare users: User[];
}
