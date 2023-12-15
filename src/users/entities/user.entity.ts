import { hash } from "src/utils/hashFunctions";
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ type: "varchar", length: 2000, unique: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password);
  }
}
