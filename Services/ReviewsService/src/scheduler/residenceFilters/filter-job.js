const schedule = require("node-schedule")
const act = require("../../actions.js")

sendNotOnFilter = async () => {
    const addresses = await act.actions().getAddresses()
    const resOwners = await act.actions().getResOwners()
    const usersFilters = await act.actions().getUserFilters()

    console.log(addresses, resOwners, usersFilters)
}

sendNotOnFilter()

/*const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1,3,6];
rule.hour = 20;
rule.minute = 0;

schedule.scheduleJob(rule, function(){ sendNotOnFilter() });*/