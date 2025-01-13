import express from "express"
import routes from './routes/index'
import { JWT_SECRET } from "@repo/backend-common/config";


import jwt from "jsonwebtoken";


const app = express();
app.use(express.json())
app.use('/api/v1/', routes)

app.listen(3003, () => {
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    console.log("JWT_SECRET", token);
    console.log("server started");
})
