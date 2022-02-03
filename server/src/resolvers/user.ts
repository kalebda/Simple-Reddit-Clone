import { UserAccount } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Field,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../contants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { registerValidator } from "../utils/validator";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { getConnection } from "typeorm";
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => UserAccount, { nullable: true })
  user?: UserAccount;
}

@Resolver(UserAccount)
export class UserResolver {
  //if you want to handle field level permission
  @FieldResolver(() => String)
  email(@Root() user: UserAccount, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = registerValidator(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserAccount)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (err) {
      if (err.code == "23505") {
        return {
          errors: [{ field: "username", message: "already taken sorry!" }],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await UserAccount.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "no user found" }],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;
    console.log("---req---", req.session);
    return {
      user,
    };
  }
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redisClient }: MyContext
  ) {
    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await redisClient.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );
    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">change password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redisClient, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redisClient.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const userIdNum = parseInt(userId);
    const user = await UserAccount.findOne(userIdNum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await UserAccount.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );
    await redisClient.del(key);

    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
  @Query(() => UserAccount, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<UserAccount | undefined> {
    if (!req.session.userId) {
      return undefined;
    }
    const user = await UserAccount.findOne(req.session.userId);
    return user;
  }
}
