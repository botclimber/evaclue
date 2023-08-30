import express, {Express} from "express";
import cors from "cors";
import bodyParser from "body-parser";

import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";
import patchRoutes from "./routes/patch/patchRequests";
import fileUpload from "express-fileupload";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(fileUpload())

app.use(express.static(__dirname + '/public'));

const version: string = "v2"
const service: string = "reviews"

app.use(`/${version}/${service}/`, getRoutes)   // GET
app.use(`/${version}/${service}/`, postRoutes)  // POST
app.use(`/${version}/${service}/`, patchRoutes) // PATCH

app.listen(port, () => {
  console.log(`Reviews Service listening to port: ${port}`)
})