import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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
  score: number; // cuando es teacher no tiene score 0

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Practice, (practice) => practice.dialogs)
  practice: Practice;
}
