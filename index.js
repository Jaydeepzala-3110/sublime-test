import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DBconnection } from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import filesRoutes from "./routes/file.router.js";
dotenv.config();

const app = express();

// DB connection
DBconnection();

const corsOptions = {
    origin: '*',
    credentials: true
};

// cors 
app.use(cors(corsOptions))

app.use(express.json());

app.use(userRoutes)
app.use(filesRoutes)

app.get('/', (_, res) => {
    res.json({
        msg: "hello world"
    })
})


app.listen(3000, () => {
    console.log("server is running on the port 3000")
})