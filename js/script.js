const locationInput = document.getElementById("location-input");
const findBtn = document.getElementById("find-btn");
const weatherContainer = document.getElementById("weather-container");

function checkGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherApi(
          `${position.coords.latitude},${position.coords.longitude}`
        ),
      () => fetchWeatherApi("Alexandria")
    );
  } else {
    console.log("Your Browser Doesn't Support Geolocation");
  }
}
checkGeolocation();

async function fetchWeatherApi(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=d6ecc6f2b83c4d78a3a203600242706&q=${location}&days=3`
    );
    if (response.ok) {
      const data = await response.json();
      displayData(data);
    }
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
}

function displayData(data) {
  weatherContainer.innerHTML = "";
  const {
    location,
    forecast: { forecastday },
  } = data;
  const { name, country } = location;
  for (const day of forecastday) {
    const html = `
    <div class="col-md-4">
      <div class="blur p-3 bg-white text-center bg-opacity-50 rounded-3 shadow-sm">
        <h2 class="mb-3 text-dark fw-bold fs-4 border-bottom pb-3 border-2 border-custom-blue">
          ${formatDate(day.date)}
        </h2>
        <p class="fw-bold fs-5 text-dark mb-0">${name}, ${country}</p>
        <img
          src="${day.day.condition.icon}"
          alt="${day.day.condition.text}"
        />
        <p class="mb-1 display-4 fw-bold">
          ${Math.round(day.day.avgtemp_c)}<sup>o</sup>C
        </p>
        <p class="fw-bold text-custom-blue fs-5 mb-2 ">
          ${day.day.condition.text}
        </p>
        <div class="d-flex align-items-center justify-content-between">
          <p class="mb-0 fw-bold text-dark fs-6 d-flex align-items-center">
            ${Math.round(day.day.maxwind_kph)} km/h
            <img class="ms-2" src="imgs/wind.png" alt="wind icon" />
          </p>
          <p class="mb-0 fw-bold text-dark fs-6 d-flex align-items-center">
            ${Math.round(day.day.avghumidity)} %
            <img class="ms-2" src="imgs/umberella.png" alt="umberella icon" />
          </p>
        </div>
      </div>
    </div>`;
    weatherContainer.innerHTML += html;
  }
}

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthIndex = date.getMonth();
  const month = months[monthIndex];
  const formattedDate = `${dayOfWeek} - ${dayOfMonth} ${month}`;
  return formattedDate;
};

locationInput.addEventListener("keypress", function (event) {
  fetchWeatherApi(event.target.value);
});

findBtn.addEventListener("click", function () {
  fetchWeatherApi(locationInput.value);
});


