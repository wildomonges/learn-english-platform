import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Practice } from './practice.entity';

@Entity()
export class Dialog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  dialog: string;

  @Column()
  order: number;

  @Column()
  score: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Practice, (practice) => practice.dialogs)
  practice: Practice;
}
