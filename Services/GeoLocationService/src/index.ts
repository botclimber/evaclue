import express, {Express, Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";

import getRoutes from "./routes/get/getRequests";
import postRoutes from "./routes/post/postRequests";

const app: Express = express();
const port = process.env.geo_PORT || 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

const version: string = "v1"
const service: string = "geo"

app.use(`/${service}/${version}/`, getRoutes)   // GET
app.use(`/${service}/${version}/`, postRoutes)  // POST

app.listen(port, () => {
  console.log(`GeoLocation Service listening to port: ${port}`)
})