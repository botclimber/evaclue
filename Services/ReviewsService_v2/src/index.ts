import express, {Express} from "express";
import cors from "cors";
import bodyParser from "body-parser";

import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";
import patchRoutes from "./routes/patch/patchRequests";
import fileUpload from "express-fileupload";


const app: Express = express();
const port = process.env.rev_PORT || 8000;

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

app.use(cors())
app.use(fileUpload())

app.use(express.static(__dirname + '/public'));

const version: string = "v2"
const service: string = "reviews"

app.use(`/${service}/${version}/`, getRoutes)   // GET
app.use(`/${service}/${version}/`, postRoutes)  // POST
app.use(`/${service}/${version}/`, patchRoutes) // PATCH

app.listen(port, () => {
  console.log(`Reviews Service listening to port: ${port}`)
})