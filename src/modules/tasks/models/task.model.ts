import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Table({ tableName: 'tasks', timestamps: true })
export class Task extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.ENUM(...Object.values(TaskStatus)), defaultValue: TaskStatus.PENDING })
  declare status: TaskStatus;

  @Column({ type: DataType.ENUM(...Object.values(TaskPriority)), defaultValue: TaskPriority.MEDIUM })
  declare priority: TaskPriority;

  @Column({ type: DataType.DATE, allowNull: true })
  declare dueDate: Date;

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
