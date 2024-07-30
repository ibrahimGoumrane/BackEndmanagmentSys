import {cleanEnv, url} from "envalid";
import {port , str , num} from "envalid";

export default cleanEnv(process.env,{
    PORT :port(),
    SESSION_SECRET : str(),
    DB_HOST : str(),
    DB_USER : str(),
    DB_PASSWORD : str(),
    DB_NAME : str(),
    DB_PORT : port(),
    CONNECT_TIMEOUT : num(),
    DATABASE_URL : url(),
    DEV_ORIGIN : url(),
})