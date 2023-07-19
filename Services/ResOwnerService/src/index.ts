import express, {Express, Request, Response} from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";
import patchRoutes from "./routes/patch/patchRequests";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

const version: string = "v1"
const service: string = "resOwners"

app.use(`/${version}/${service}/`, getRoutes)   // GET
app.use(`/${version}/${service}/`, postRoutes)  // POST
app.use(`/${version}/${service}/`, patchRoutes) // PATCH

app.listen(port, () => {
  console.log(`ResidenceOwners Service listening to port: ${port}`)
})