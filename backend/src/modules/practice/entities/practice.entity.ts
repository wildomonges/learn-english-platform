import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
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

  @ManyToOne(() => User, (user) => user.practices, { eager: true })
  user: User;

  @OneToMany(() => Dialog, (dialog) => dialog.practice, {
    cascade: true,
    eager: true,
  })
  dialogs: Dialog[];

  @CreateDateColumn()
  createdAt: Date;
}
