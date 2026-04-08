import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Role } from '../../roles/models/role.model';
import { Permission } from '../../permissions/models/permission.model';
import { UserPermission } from './user-permission.model';
import { AuditLog } from '../../audit-logs/models/audit-log.model';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM(...Object.values(UserStatus)), defaultValue: UserStatus.ACTIVE })
  declare status: UserStatus;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: true })
  declare roleId: string;

  @BelongsTo(() => Role)
  declare role: Role;

  // For Manager -> Agent, Agent -> Customer hierarchy
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare managerId: string;

  @BelongsTo(() => User, 'managerId')
  declare manager: User;

  @HasMany(() => User, 'managerId')
  declare managedUsers: User[];

  @BelongsToMany(() => Permission, () => UserPermission)
  declare extraPermissions: Permission[];

  @HasMany(() => AuditLog)
  declare auditLogs: AuditLog[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare refreshToken: string;
}
