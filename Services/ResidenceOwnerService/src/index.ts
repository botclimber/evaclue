
import "express-async-errors";
import express from "express";
import routes from "./routes/routes";
// import { errorMiddleware } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import "dotenv/config";

// Initialize app
try {
  const cors = require("cors");
  console.log("teste");
  const app = express();
  //app.use(helmet());

  const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  app.use(express.json());
  app.use(cors(corsOptions)); // Use this after the variable declaration
  app.use("/residenceOwner", routes);
  // app.use(errorMiddleware);

  const port = 7300;
  app.listen(port, () => {
    console.log(`${port}`);
  });
} catch (e: any) {
  console.log(`error initializing app`);
}

