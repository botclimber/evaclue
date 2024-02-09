import express, {Express, Request, Response} from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";
import patchRoutes from "./routes/patch/patchRequests";
import delRoutes from "./routes/delete/delRequests";

const app: Express = express();
const port = process.env.resowners_PORT || 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(fileUpload())

const version: string = "v1"
const service: string = "resowners"

app.use(`/${service}/${version}/`, getRoutes)   // GET
app.use(`/${service}/${version}/`, postRoutes)  // POST
app.use(`/${service}/${version}/`, patchRoutes) // PATCH
app.use(`/${service}/${version}/`, delRoutes) // DELETE

app.listen(port, () => {
  console.log(`ResidenceOwners Service listening to port: ${port}`)
})