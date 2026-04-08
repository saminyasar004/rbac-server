import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

@Table({ tableName: 'leads', timestamps: true })
export class Lead extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  company: string;

  @Column({ type: DataType.ENUM(...Object.values(LeadStatus)), defaultValue: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  assignedTo: string;

  @BelongsTo(() => User, 'assignedTo')
  assignedUser: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  creator: User;
}
