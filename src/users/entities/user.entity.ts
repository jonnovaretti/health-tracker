import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  externalId: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
