import { Request, Response } from "express";
import session, { SessionData } from "express-session";
import { Redis } from "ioredis";
// export type SessionWithUser = session.Session &
//   Partial<SessionData> & { userId: number | {} };

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

export type MyContext = {
  req: Request & { session: session.Session & Partial<SessionData> };
  res: Response;
  redisClient: Redis;
};
