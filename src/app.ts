import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import http from "http";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import usersRoute from "./routes/user";
import requiresAuth from "./middleware/requireAuth";
import skillRoute from "./routes/skills";
import taskRoute from "./routes/task";
import teamRoute from "./routes/team";
import statusRoute from "./routes/status";
import projectRoute from "./routes/project";
import commentRoute from "./routes/comment";
import activityRoute from "./routes/activity";
import chatRoute from "./routes/chat";
import env from "./util/validateEnv";

const app = express();
const server = http.createServer(app);

// Define CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure OPTIONS is included
  credentials: true,
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight request handling

app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Setting up my endpoints
app.use("/api/users", usersRoute);
app.use("/api/skills", skillRoute);
app.use("/api/tasks", requiresAuth, taskRoute);
app.use("/api/teams", requiresAuth, teamRoute);
app.use("/api/status", statusRoute);
app.use("/api/projects", requiresAuth, projectRoute);
app.use("/api/comments", requiresAuth, commentRoute);
app.use("/api/activity", requiresAuth, activityRoute);
app.use("/api/chat", requiresAuth, chatRoute);

// Catches any URL that has no related route handler
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// Error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({
    error: errorMessage,
  });
});

export default server;
