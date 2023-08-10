import express, {Express, Request, Response} from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import bodyParser from "body-parser";

//import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";
//import patchRoutes from "./routes/patch/patchRequests";

const app: Express = express();
const port = process.env.PORT || 8049;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(fileUpload())

const version: string = "v1"
const service: string = "fileHandler"

//app.use(`/${version}/${service}/`, getRoutes)   // GET
app.use(`/${version}/${service}/`, postRoutes)  // POST
//app.use(`/${version}/${service}/`, patchRoutes) // PATCH

app.listen(port, () => {
  console.log(`FileHandler Service listening to port: ${port}`)
})