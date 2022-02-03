import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./contants";
import { PostResolver } from "./resolvers/post";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/user";
const Redis = require("ioredis");
const session = require("express-session");
import cors from "cors";
// import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { createConnection } from "typeorm";
import { Post } from "./entities/Posts";
import { UserAccount } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";

//main rerun
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, UserAccount, Updoot],
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = require("connect-redis")(session);
  // const redisClient = redis.createClient();
  const redisClient = new Redis();
  // (async () => {
  //   const redisClient = redis.createClient();

  //   redisClient.on("error", (err: object) =>
  //     console.log("Redis Client Error", err)
  //   );

  //   await redisClient.connect();
  // })();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      saveUninitialized: false,
      secret: "keyboard cat",
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
    })
  );

  const apolloServer = await new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redisClient }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
// function User(User: any, arg1: {}) {
//   throw new Error("Function not implemented.");
// }
