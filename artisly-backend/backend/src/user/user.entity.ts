import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type Role = 'fan' | 'celebrity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['fan', 'celebrity'] })
  role: Role;
}