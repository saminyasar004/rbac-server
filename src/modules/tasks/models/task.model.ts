import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

export enum TaskStatus {
  TODO = 'TODO',
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
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.ENUM(...Object.values(TaskStatus)), defaultValue: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: DataType.ENUM(...Object.values(TaskPriority)), defaultValue: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: DataType.DATE, allowNull: true })
  dueDate: Date;

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
