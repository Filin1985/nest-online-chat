import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'chat_messages' })
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: Users;
}
