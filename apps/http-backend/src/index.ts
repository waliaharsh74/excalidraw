import express from "express"
import cors from "cors"
import routes from './routes/index';
import 'dotenv/config'


const app = express();
const port=process.env.PORT
app.use(cors())
app.use(express.json())
app.use('/api/v1/', routes)

app.listen(port, () => {
    console.log("server started");
})
