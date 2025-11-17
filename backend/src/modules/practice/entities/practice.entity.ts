import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { Dialog } from './dialog.entity';

@Entity()
export class Practice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column()
  topic: string;

  @Column()
  interest: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.practices)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Dialog, (dialog) => dialog.practice, {
    cascade: true,
  })
  dialogs: Dialog[];

  @CreateDateColumn()
  createdAt: Date;
}
