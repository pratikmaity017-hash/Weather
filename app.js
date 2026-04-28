// Weather App JavaScript
const apiKey = "d0a9e589bbe79a2126a21fe4cd3cee92";

const searchBtn = document.querySelector("#search");
const locationBtn = document.querySelector("#location");

const loading = document.querySelector("#loading");
const resultBox = document.querySelector(".result");

function showLoading() {
  resultBox.classList.add("loading-state");
  loading.style.display = "block";
}

function hideLoading() {
  resultBox.classList.remove("loading-state");
  loading.style.display = "none";
}

function clearUI() {
  document.querySelector("#cityName").textContent = "";
  document.querySelector("#temp").textContent = "";
  document.querySelector("#des").textContent = "";
  document.querySelector("#wind").textContent = "";
  document.querySelector("#icon").src = "";
  document.querySelector("#icon").alt = "";
}

// Function to update the UI with weather data
function updateUI(data) {
  let cityName = document.querySelector("#cityName");
  let temp = document.querySelector("#temp");
  let des = document.querySelector("#des");
  let icon = document.querySelector("#icon");
  let wind = document.querySelector("#wind");
  const cityInput = document.querySelector("#city");

  let iconCode = data.weather[0].icon;
  icon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
  icon.alt = data.weather[0].description;

  cityName.textContent = data.name;
  temp.textContent = `Temperature: ${data.main.temp} °C`;
  des.textContent = `Description: ${data.weather[0].description}`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  cityInput.value = data.name;

  // Dynamic background
  const resultBox = document.querySelector(".result");
  const weatherMain = data.weather[0].main;

  const weatherThemes = {
    Clear: "linear-gradient(135deg, #facc15, #f97316)", // ☀️ Sunny
    Clouds: "linear-gradient(135deg, #94a3b8, #64748b)", // ☁️ Cloudy
    Rain: "linear-gradient(135deg, #0ea5e9, #1e3a8a)", // 🌧️ Rain
    Drizzle: "linear-gradient(135deg, #38bdf8, #0ea5e9)", // 🌦️ Light rain
    Thunderstorm: "linear-gradient(135deg, #1e293b, #020617)", // ⛈️ Storm
    Snow: "linear-gradient(135deg, #e0f2fe, #bae6fd)", // ❄️ Snow
    Mist: "linear-gradient(135deg, #cbd5f5, #94a3b8)", // 🌫️ Mist
    Smoke: "linear-gradient(135deg, #6b7280, #374151)", // 🌫️ Smoke
    Haze: "linear-gradient(135deg, #d1d5db, #9ca3af)", // 🌁 Haze
    Dust: "linear-gradient(135deg, #fde68a, #f59e0b)", // 🌪️ Dust
    Fog: "linear-gradient(135deg, #e5e7eb, #9ca3af)", // 🌫️ Fog
    Sand: "linear-gradient(135deg, #fcd34d, #d97706)", // 🏜️ Sand
    Ash: "linear-gradient(135deg, #9ca3af, #4b5563)", // 🌋 Ash
    Squall: "linear-gradient(135deg, #475569, #1e293b)", // 💨 Wind storm
    Tornado: "linear-gradient(135deg, #111827, #000000)", // 🌪️ Tornado
  };

  if (["Snow", "Mist", "Fog", "Haze"].includes(weatherMain)) {
    resultBox.style.color = "#0f172a"; // dark text
    des.style.color = "orange";
    wind.style.color = "yellow";
  } else {
    resultBox.style.color = ""; // light text
  }

  resultBox.style.background = weatherThemes[weatherMain] || "#0f172a";
}

// function to fetch weather data by city name
function fetchWeatherByCity(city) {
  //   clearUI();
  showLoading();
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
  )
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      if (data.cod !== 200) {
        alert("City not found. Please try again.");
        return;
      }
      updateUI(data);
    })
    .catch(() => {
      hideLoading();
      alert("An error occurred while fetching weather data. Please try again.");
    });
}

//function to fetch weather data by current location
function fetchWeatherByLocation(lat, lon) {
  //   clearUI();
  showLoading();
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  )
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      if (data.cod !== 200) {
        alert(
          "Unable to fetch weather data for your location. Please try again.",
        );
        return;
      }
      updateUI(data);
    })
    .catch(() => {
      hideLoading();
      alert("An error occurred while fetching weather data. Please try again.");
    });
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const cityInput = document.querySelector("#city").value.trim();
  fetchWeatherByCity(cityInput);
});

// Event listener for Enter key in city input

document.querySelector("#city").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const cityInput = document.querySelector("#city").value.trim();
    fetchWeatherByCity(cityInput);
  }
});

// Event listener for location button

locationBtn.addEventListener("click", () => {
  document.querySelector("#city").value = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByLocation(lat, lon);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
