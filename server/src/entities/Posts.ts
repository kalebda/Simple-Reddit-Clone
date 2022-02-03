import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { UserAccount } from "./User";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @Column()
  text!: string;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => UserAccount)
  @ManyToMany(() => UserAccount, (user) => user.posts)
  creator: UserAccount;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
