import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Celebrity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  country: string;

  @Column()
  instagramUrl: string;

  @Column()
  fanbaseCount: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  profileViews: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;
}
