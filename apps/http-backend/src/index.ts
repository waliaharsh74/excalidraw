import express from "express"
import routes from './routes/index'
    ;


const app = express();
app.use(express.json())
app.use('/api/v1/', routes)

app.listen(3003, () => {
    console.log("server started");
})
