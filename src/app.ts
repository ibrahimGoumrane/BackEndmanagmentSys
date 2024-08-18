import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import http from "http";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import requiresAuth from "./middleware/requireAuth";
import chatRoute from "./routes/chat";
import commentRoute from "./routes/comment";
import projectRoute from "./routes/project";
import skillRoute from "./routes/skills";
import statusRoute from "./routes/status";
import taskRoute from "./routes/task";
import teamRoute from "./routes/team";
import usersRoute from "./routes/user";
import env from "./util/validateEnv";

import path, { resolve } from "path";
import { setupSocketServer } from "./Sockets/socketServer";

export const projectRoot = resolve(__dirname, ".."); // Adjust the number of '..' based on your directory structure

const app = express();
export const server = http.createServer(app);

// Define CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure OPTIONS is included
  credentials: true,
};
setupSocketServer(server, corsOptions);

//this middleware will be used to Serve static files
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight request handling

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(fileUpload()); // If using express-fileupload
app.use(bodyParser.json()); // Parse JSON bodies

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
