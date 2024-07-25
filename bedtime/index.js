dayjs.extend(dayjs_plugin_advancedFormat);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

let timeParam = new URLSearchParams(window.location.search).get('time');

if (!timeParam) {
  throw new Error(`No time parameter found in URL`);
}

timeParam = timeParam.toUpperCase();

document.querySelector('#waketime').value = timeParam;

const wakeWindow =
  new URLSearchParams(window.location.search).get('window') || '5.5';

function addTime(time, hoursToAdd, minutesToAdd) {
  time = time.replace('PM', ' PM').replace('AM', ' AM');

  const today = dayjs().format('M/DD/YY');
  const formattedTime = dayjs(`${today} ${time}`, `M/DD/YY h:mmA`);

  let newTime;

  // Add hours or minutes
  if (minutesToAdd) {
    newTime = formattedTime.subtract(hoursToAdd, 'minute');
  } else {
    newTime = formattedTime.add(hoursToAdd, 'hour');
  }

  // Return the new time in the same format
  return newTime.format('h:mmA');
}

const sleep = addTime(timeParam, wakeWindow);
console.log('asleep', sleep);

const bed = addTime(sleep, 10, true);
console.log('bed', bed);

const bathStoryTime = addTime(bed, 27, true);
console.log('bathStoryTime', bathStoryTime);

const storyTime = addTime(bed, 24, true);
console.log('bathStoryTime', bathStoryTime);

const dadTime = addTime(bed, 7, true);
console.log('dadTime', dadTime);

const dinner = addTime(sleep, 60, true);
console.log('dinner', dinner);

const readyForBedBathNight = addTime(bed, 14, true);
console.log('readyForBedBathNight', readyForBedBathNight);

const readyForBedNotaBathNight = addTime(bed, 24, true);
console.log('readyForBedNotaBathNight', readyForBedNotaBathNight);

const html = `
  <div>
    <h1>Bedtime Routine</h1>
    <p>🍽️ Dinner: <b>${dinner}</b></p>
    <hr />
    <p>🛁 Bath: <b>${bathStoryTime}</b></p>
    <p>📖 Story Time: <b>${storyTime}</b></p>
    <hr />
    <p>👨‍🍼 Dad: <b>${dadTime}</b></p>
    <p>🛏️ Bed: <b>${bed}</b></p>
    <p>😴 Sleep: <b>${sleep}</b></p>
  </div>
`;

document.querySelector('h1').innerText = '';
document.querySelector('#main').innerHTML = html;

const updateButton = document.querySelector('.update-time');

updateButton.addEventListener('click', () => {
  const value = document.querySelector('#waketime').value;

  if (value) {
    updateQueryParam(value);
    window.location.reload();
  }
});

function updateQueryParam(newTime) {
  newTime = newTime.toUpperCase();
  const url = new URL(window.location.href); // Get the current URL
  url.searchParams.set('time', newTime); // Set the new value for the "time" parameter
  window.history.replaceState({}, '', url); // Update the URL without reloading the page
}

// Bed: 6:50
// Dad: 6:43
// Bath/Story Time: 6:31
// Ready for Bed: 6:26
// Dinner: 6:08
