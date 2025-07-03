import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Celebrity } from '../../celebrity/entities/celebrity.entity';

@Entity()
export class Fan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Celebrity)
  @JoinTable()
  followedCelebrities: Celebrity[];
}
