import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // Use `number` or `string` depending on your user ID type
  }
}
