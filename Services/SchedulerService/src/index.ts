import express, {Express} from "express";
import { Scheduler } from "./controllers/Scheduler";
import * as schedule from "node-schedule" 

const app: Express = express();
const port = process.env.PORT || 8000;

const rule = new schedule.RecurrenceRule()

/**
 * runs on monday, wednesday and saturday
 */
rule.dayOfWeek = [1,3,6];
rule.hour = 20;
rule.minute = 0;

schedule.scheduleJob(rule, async function(){
  await new Scheduler().sendAvailableResidencesByFilter()
});

app.listen(port, () => {
  console.log(`Scheduler Service listening to port: ${port}`)
})