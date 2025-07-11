import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Practice } from 'src/practice/entities/practice.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  @OneToMany(() => Practice, (practice) => practice.user)
  practices: Practice[];
}
