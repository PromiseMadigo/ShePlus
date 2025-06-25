const apiKey = "9fa4a460b48445f71afa1b1b17e9515f"; // Your actual API key

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("city-input").value;
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) return alert("City not found");
      const { lat, lon, name } = data[0];
      document.getElementById("city-name").textContent = name;
      getWeather(lat, lon);
    });
});

function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayCurrent(data.current);
      displayHourly(data.hourly);
      displayDaily(data.daily);
    });
}

function displayCurrent(current) {
  document.getElementById("current-temp").textContent = `${Math.round(
    current.temp
  )}°C | ${current.weather[0].description}`;
}

function displayHourly(hourly) {
  const hourlyDiv = document.getElementById("hourly");
  hourlyDiv.innerHTML = "";
  hourly.slice(0, 12).forEach((hour) => {
    const time = new Date(hour.dt * 1000).getHours();
    const temp = Math.round(hour.temp);
    const icon = hour.weather[0].icon;
    hourlyDiv.innerHTML += `
      <div class="hour-card">
        <p>${time}:00</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
        <p>${temp}°</p>
      </div>`;
  });
}

function displayDaily(daily) {
  const dailyDiv = document.getElementById("daily");
  dailyDiv.innerHTML = "";
  daily.slice(1, 8).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.weather[0].icon;
    const min = Math.round(day.temp.min);
    const max = Math.round(day.temp.max);
    dailyDiv.innerHTML += `
      <div class="day-card">
        <p>${weekday}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
        <p>${min}° - ${max}°</p>
        <div class="temp-bar" style="width: ${(max - min) * 5}px"></div>
      </div>`;
  });
}
