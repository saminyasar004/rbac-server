import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'audit_logs', timestamps: true, updatedAt: false })
export class AuditLog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action: string; // e.g. "USER_CREATED", "PERMISSION_TOGGLED"

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resource: string; // e.g. "users", "leads"

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  details: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress: string;
}
