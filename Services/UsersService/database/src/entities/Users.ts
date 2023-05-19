import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true, length: 60 })
  email: string;

  @Column("varchar", { unique: true, length: 30 })
  username: string;

  @Column("varchar", { length: 30 })
  firstName: string;

  @Column("varchar", { length: 120 })
  image: string;

  @Column("varchar", { length: 30 })
  lastName: string;

  @Column("varchar", { length: 128 })
  password: string;

  @Column("varchar", { length: 30 })
  type: string;

  @Column("boolean", { default: false })
  blocked: boolean = false;

  @Column("boolean", { default: false })
  verified: boolean = false;
}
