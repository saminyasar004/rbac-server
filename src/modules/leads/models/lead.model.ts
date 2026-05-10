import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
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
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare company: string;

  @Column({
    type: DataType.ENUM(...Object.values(LeadStatus)),
    defaultValue: LeadStatus.NEW,
  })
  declare status: LeadStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare assignedTo: string;

  @BelongsTo(() => User, 'assignedTo')
  declare assignedUser: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  declare creator: User;
}
