import "dotenv/config";
import env from "./util/validateEnv";
import server from "./app";
import { PrismaClient } from "@prisma/client";
import { resolve } from "path";

export const projectRoot = resolve(__dirname, ".."); // Adjust the number of '..' based on your directory structure

const port = env.PORT;
const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    console.log("Connected to the database");
    server.listen(port, () => {
      //this is server listen you manually craeted the http server  and run it instead of letting express generate it for u .
      console.log("Server running on port " + port);
    });
  })
  .catch(console.error);
