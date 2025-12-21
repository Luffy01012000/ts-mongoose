import type { StringValue } from "ms"; // comes from jsonwebtoken library
// type StringValue =
//   | `${number}`
//   | `${number}ms`
//   | `${number}s`
//   | `${number}m`
//   | `${number}h`
//   | `${number}d`
//   | `${number}w`
//   | `${number}y`;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY! as StringValue;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY! as StringValue;
