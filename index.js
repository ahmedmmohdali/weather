const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function search(query) {
  try {
    let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=32337463b13d4264b39234113250405&q=${query}&days=3`);
    if (res.ok) {
      let data = await res.json();
      displayCurrent(data.location, data.current);
      displayAnother(data.forecast.forecastday);
    } else {
      console.error("Error fetching weather data");
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

function displayCurrent(location, current) {
  const date = new Date(current.last_updated.replace(" ", "T"));
  const html = `
    <div class="today forecast">
      <div class="forecast-header" id="today">
        <div class="day">${days[date.getDay()]}</div>
        <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
      </div>
      <div class="forecast-content" id="current">
        <div class="location">${location.name}</div>
        <div class="degree">
          <div class="num">${current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="https:${current.condition.icon}" alt="" width="90">
          </div>
        </div>
        <div class="custom">${current.condition.text}</div>
        <span><img src="images/icon-umberella.png" alt=""> 20%</span>
        <span><img src="images/icon-wind.png" alt=""> ${current.wind_kph} km/h</span>
        <span><img src="images/icon-compass.png" alt=""> ${current.wind_dir}</span>
      </div>
    </div>`;
  document.getElementById("forecast").innerHTML = html;
}

function displayAnother(forecastDays) {
  let html = "";
  for (let i = 1; i < forecastDays.length; i++) {
    let dayDate = new Date(forecastDays[i].date);
    html += `
      <div class="forecast">
        <div class="forecast-header">
          <div class="day">${days[dayDate.getDay()]}</div>
        </div>
        <div class="forecast-content">
          <div class="forecast-icon">
            <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48">
          </div>
          <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
          <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
          <div class="custom">${forecastDays[i].day.condition.text}</div>
        </div>
      </div>`;
  }
  document.getElementById("forecast").innerHTML += html;
}

search("Cairo");

document.getElementById("submit").addEventListener("click", () => {
  let value = document.getElementById("search").value.trim();
  if (value.length > 2) {
    search(value);
  }
});

document.getElementById("search").addEventListener("keyup", (e) => {
  let value = e.target.value.trim();
  if (value.length > 2) {
    search(value);
  }
});
