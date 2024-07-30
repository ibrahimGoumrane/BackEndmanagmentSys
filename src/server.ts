import "dotenv/config";
import env from "./util/validateEnv";
import server from "./app";
// import  {instrument} from '@socket.io/admin-ui'
import { PrismaClient } from "@prisma/client";

const port = env.PORT ;


const prisma = new PrismaClient() ;


// instrument(io, {
//     auth: false,
//     mode: "development",
//     namespaceName :"admin",
// });



prisma.$connect().then(()=>{
    console.log("Connected to the database") ;
    server.listen(port ,()=>{ //this is server listen you manually craeted the http server  and run it instead of letting express generate it for u .
        console.log("Server running on port " + port) ;
    });
}).catch(console.error);


