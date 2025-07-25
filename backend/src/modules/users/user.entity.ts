import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Practice } from 'src/modules/practice/entities/practice.entity';
import { Exclude } from 'class-transformer';

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

  @Exclude()
  @Column()
  password: string;
  @OneToMany(() => Practice, (practice) => practice.user)
  practices: Practice[];
}
