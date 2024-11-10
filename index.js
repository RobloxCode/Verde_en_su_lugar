import { getCelsius } from "./data/kelvin-to-celsius.js";
import { trees } from "./data/trees.js";

// probably will have to change the ApiKey some othe day
const apiKey = 'b7b2f38996720a53c2c77ad4542b0d2c';

async function getWeatherData() {
  
  const city = getCity();
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      showError('Ciudad no valida');
      throw new Error('Could not fetch weather data');
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Error:", error);
  }
}

function showError(message) {
  let errorContainer = document.querySelector('.error-message');

  // Si el contenedor de error no existe, crearlo
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    document.body.appendChild(errorContainer);
  }

  // Actualizar el mensaje de error
  errorContainer.innerText = message;

  // Añadir estilo de error (opcional)
  errorContainer.style.color = 'red';
  errorContainer.style.fontSize = '1.2em';

  // Remover el mensaje después de un tiempo para limpieza automática
  setTimeout(() => {
    errorContainer.innerText = '';
  }, 3000);

}

function displayweatherDataInDOM(name, country, temperature, minTemperature, maxTemperature, wind, clouds, lat, long) {

  let dataContainer = document.querySelector('.data-container');

  // Si el contenedor de datos no existe, lo creamos y añadimos al cuerpo del documento
  if (!dataContainer) {
    dataContainer = document.createElement('div');
    dataContainer.classList.add('data-container');
    document.body.append(dataContainer);
  } else {
    // Si el contenedor existe, limpiamos su contenido antes de agregar nuevos datos
    dataContainer.innerHTML = "";
  }

  // Insertar el nuevo contenido de los datos del clima
  dataContainer.innerHTML = `
    <div class="weather-info-container">
      <img src="tree-photos/flag-photo/cloud.png" class="cloud-image">
      <div>
        <p class="city-name">${name} ${country} <img src="tree-photos/flag-photo/${country.toLowerCase()}-flag.png" alt=""></p>
      </div>
      <div class="temperature-info-container">
        <p class="temperature-container">${temperature}°C</p>
        <p class="info-container">temperatura desde ${minTemperature} hasta ${maxTemperature}°, viento ${wind} m/s. Nubes ${clouds}%</p>
      </div>
      <div>
        <p class="coords-container">coordenadas geo. [${lat} , ${long}]</p>
      </div>
    </div>
  `;
}

async function validateInputs() {
  const city = getCity();
  const code = getCode();

  if (city === "" || code === "") {
    showError('Debes llenar todos los campos!!');
    return false;
  }

  if (!(await checkCityExists(city))) {
    showError('Ciudad no válida!!');
    return false;
  }

  if (!isValidCode(code)) {
    showError('Código postal no válido!!');
    return false;
  }

  return true;
}

async function displayWeatherInfo() {
  if (!(await validateInputs())) return;

  const weatherData = await getWeatherData();
  if (!weatherData) return;

  // Extraer y mostrar datos del clima como antes
  const name = weatherData.name;
  const country = weatherData.sys.country;
  const temperature = Math.round(getCelsius(weatherData.main.temp));
  const minTemperature = getCelsius(weatherData.main.temp_min);
  const maxTemperature = Math.round(getCelsius(weatherData.main.temp_max));
  const wind = weatherData.wind.speed;
  const clouds = weatherData.clouds.all;
  const lat = weatherData.coord.lat;
  const long = weatherData.coord.lon;

  displayweatherDataInDOM(name, country, temperature, minTemperature, maxTemperature, wind, clouds, lat, long);
  displayMap([lat, long]);
}

function getTreeMinTemperature(numTree) {
  return trees[numTree].temp_min;
}

function getTreeMaxTemperature(numTree) {
  return trees[numTree].temp_max;
}

async function getCityMinTemperature() {
  const weatherData = await getWeatherData();
  return weatherData ? weatherData.main.temp_min : null;
}

async function getCityMaxTemperature() {
  const weatherData = await getWeatherData();
  return weatherData ? weatherData.main.temp_max : null;
}

async function getTreesToPlant() {
  let treesToPlant = [];

  const cityMinTemperature = getCelsius(await getCityMinTemperature());
  const cityMaxTemperature = Math.round(getCelsius(await getCityMaxTemperature()));

  for(let i = 0; i < trees.length; i++) {
    
    let treeMinTemperature = getTreeMinTemperature(i);
    let treeMaxTemperature = getTreeMaxTemperature(i);

    // asegurar que el arbol pueda soportar las temperaturas minimas y maximas
    if(treeMinTemperature <= cityMinTemperature && treeMaxTemperature >= cityMaxTemperature) {
      treesToPlant.push(trees[i].nombre);
    }
  }

  return treesToPlant;

}

function isValidCode(code) {
  return code.length === 5;
}

async function checkCityExists(cityName) {
  
  const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`);
  const data = await response.json();
  
  if (data.length > 0) {
    return true;
  } 
  else {
    return false;
  }

}

function getCity() {
  return document.querySelector('.city-input').value; 
}

function getCode() {
  return document.querySelector('.postal-code-input').value;
}

async function displayMap(coords) {
  let mapContainer = document.querySelector('.map-container');

  // Si el contenedor del mapa no existe, lo creamos y añadimos al cuerpo del documento
  if (!mapContainer) {
    mapContainer = document.createElement('div');
    mapContainer.classList.add('map-container');
    document.body.appendChild(mapContainer);
  } else {
    // Si el contenedor existe, lo limpiamos antes de agregar un nuevo mapa
    mapContainer.innerHTML = "";
  }

  // Inicializa el mapa y lo centra en las coordenadas especificadas
  const map = L.map(mapContainer).setView(coords, 13);

  // Agrega las teselas de OpenStreetMap al mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Añade un marcador en las coordenadas
  L.marker(coords).addTo(map)
    .bindPopup('¡Esta es tu ubicación seleccionada!');
}

async function showTreeResults() {

  if(!validateInputs()) return;

  const treesContainer = document.querySelector('.trees-container');

  // checking if the results are already displayed
  if(treesContainer.querySelector('.result-text')) {
    return;
  }

  const treesToPlant = await getTreesToPlant();
  let treesToPlantLower = treesToPlant.map(word => word.toLowerCase());
  
  const text = document.createElement('h1');
  text.innerText = 'En tu localida puedes plantar:';
  text.classList.add('result-text');
  treesContainer.append(text);

  for(let i = 0; i < treesToPlant.length; i++) {
    const div = document.createElement('div');

    div.innerHTML = `

      <div class="trees-to-plant">
        
        <p class="tree-name">${treesToPlant[i]}</p>

        <img src="tree-photos/trees-imgs/${treesToPlantLower[i]}.jpg" class="tree-img">

      </div>

    `;

    treesContainer.append(div);
  }

}

document.querySelector('.show-trees-button').addEventListener('click', async () => {
  await displayWeatherInfo();
  showTreeResults();
});

document.querySelector('.city-input').addEventListener('keydown', async event => {
  if(event.key === 'Enter') {
    await displayWeatherInfo();
    showTreeResults();
  }
});

document.querySelector('.postal-code-input').addEventListener('keydown', async event => {
  if(event.key === 'Enter') {
    await displayWeatherInfo();
    showTreeResults();
  }
});