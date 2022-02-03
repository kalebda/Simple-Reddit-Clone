import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { UserAccount } from "./User";
import { Post } from "./Posts";

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => UserAccount, (user) => user.updoots)
  user: UserAccount;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE",
  })
  post: Post;
}
