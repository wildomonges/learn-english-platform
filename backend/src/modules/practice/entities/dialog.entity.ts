import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Practice } from './practice.entity';

@Entity()
export class Dialog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  speaker: string;

  @Column('text')
  textEnglish: string;

  @Column('text')
  textSpanish: string;

  @Column('text')
  response: string;

  @Column()
  order: number;

  @Column()
  score: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Practice, (practice) => practice.dialogs)
  @JoinColumn({ name: 'practiceId' })
  practice: Practice;
}
