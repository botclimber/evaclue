import express, {Express} from "express";
import { Scheduler } from "./controllers/Scheduler";
import * as schedule from "node-schedule" 

const app: Express = express();
const port = process.env.schedule_PORT || 8000;

const week = {
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
  "sunday": 7
}

const rule = new schedule.RecurrenceRule()

//rule.dayOfWeek = [week.monday, week.wednesday, week.saturday];
rule.dayOfWeek = [week.tuesday];
rule.hour = 10;
rule.minute = 40;

schedule.scheduleJob(rule, async function(){
  console.log(`Scheduler started for send email with available residences by filter at ${rule.dayOfWeek} ${rule.hour}:${rule.minute}`)
  await new Scheduler().sendAvailableResidencesByFilter()
});

// TODO: clean up task that remove from Residences table all residences not assigned to a review

app.listen(port, () => {
  console.log(`Scheduler Service listening to port: ${port}`)
})