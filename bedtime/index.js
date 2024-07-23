dayjs.extend(dayjs_plugin_advancedFormat);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

const timeParam = new URLSearchParams(window.location.search).get("time");
const wakeWindow =
  new URLSearchParams(window.location.search).get("window") || "6";

function addHoursToTime(time, hoursToAdd, minutesToAdd) {
  time = time.replace("PM", " PM").replace("AM", " AM");

  const today = dayjs().format("M/DD/YY");
  const formattedTime = dayjs(`${today} ${time}`, `M/DD/YY h:mmA`);

  let newTime;

  // Add hours or minutes
  if (minutesToAdd) {
    newTime = formattedTime.subtract(hoursToAdd, "minute");
  } else {
    newTime = formattedTime.add(hoursToAdd, "hour");
  }

  // Return the new time in the same format
  return newTime.format("h:mmA");
}

const sleep = addHoursToTime(timeParam, wakeWindow);
console.log("asleep", sleep);

const bed = addHoursToTime(sleep, 10, true);
console.log("bed", bed);

const bathStoryTime = addHoursToTime(bed, 19, true);
console.log("bathStoryTime", bathStoryTime);

const dadTime = addHoursToTime(bed, 7, true);
console.log("dadTime", dadTime);

const dinner = addHoursToTime(sleep, 52, true);
console.log("dinner", dinner);

const html = `
  <div>
    <h1>Bedtime Routine</h1>
    <p>🍽️ Dinner: <b>${dinner}</b></p>
    <p>🛁 Bath/Story Time: <b>${bathStoryTime}</b></p>
    <p>👨‍🍼 Dad: <b>${dadTime}</b></p>
    <p>🛏️ Bed: <b>${bed}</b></p>
    <p>😴 Sleep: <b>${sleep}</b></p>
  </div>
`;

document.body.innerHTML = html;

// Bed: 6:50
// Dad: 6:43
// Bath/Story Time: 6:31
// Ready for Bed: 6:26
// Dinner: 6:08
