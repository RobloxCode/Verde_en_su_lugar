import { ciudades } from "./data/ciudades.js";
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
      const text = document.createElement('h1');
      text.innerText = 'Ciudad no valida!!';

      document.body.append(text);

      throw new Error('Could not fetch weather data');
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Error:", error);
  }
}

async function displayWeatherInfo() {
  
  const inputCity = document.querySelector('.city-input');
  const inputCode = document.querySelector('.postal-code-input');

  if(inputCity.value === "" || inputCode.value === "") {
    const text = document.createElement('h1');
    text.innerText = 'debes llenar todos los campos!!';
    document.body.append(text);
    return;
  }

  const weatherData = await getWeatherData();

  // checking if the div is already displayed
  if(document.querySelector('.data-container')) {
    return;
  }

  const name = weatherData.name;
  const country = weatherData.sys.country;
  const temperature = Math.round(getCelsius(weatherData.main.temp));
  const minTemprerature = getCelsius(weatherData.main.temp_min);
  const maxTemperature = Math.round(getCelsius(weatherData.main.temp_max));
  const wind = weatherData.wind.speed;
  const clouds = weatherData.clouds.all;
  const coords = [weatherData.coord.lat, weatherData.coord.lon];

  const div = document.createElement('div');
  div.classList.add('data-container');
  div.innerHTML = `

    <div class="data-container">

      <div class="weather-info-container">

        <img src="tree-photos/flag-photo/cloud.png" class="cloud-image">

        <div>
          <p class="city-name">${name} ${country} <img src="tree-photos/flag-photo/${country.toLowerCase()}-flag.png" alt=""></p>
        </div>
        

        <div class="temperature-info-container">
          <p class="temperature-container">${temperature}°C</p>
          <p class="info-container">temperatura desde ${minTemprerature} hasta ${maxTemperature}°, viento ${wind} m/s. Nubes ${clouds}%</p>
        </div>

        <div>
          <p class="coords-container">cordenadas geo. [${weatherData.coord.lat} , ${weatherData.coord.lon}]</p>
        </div>

      </div>

    </div>

  `;

  displayMap(coords);

  const divInfo = document.querySelector('.weather-info-container-div');
  divInfo.append(div);  

}

function getTreeMinTemperature(numTree) {
  return trees[numTree].temp_min;
}

function getTreeMaxTemperature(numTree) {
  return trees[numTree].temp_max;
}

async function getCityMinTemperature() {
  const weatherData = await getWeatherData();
  return weatherData.main.temp_min;
}

async function getCityMaxTemperature() {
  const weatherData = await getWeatherData();
  return weatherData.main.temp_max;
}

async function getTreesToPlant() {
  let treesToPlant = [];

  const cityMinTemperature = getCelsius(await getCityMinTemperature());
  const cityMaxTemperature = Math.round(getCelsius(await getCityMaxTemperature()));

  for(let i = 0; i < trees.length; i++) {
    
    let treeMinTemperature = getTreeMinTemperature(i);
    let treeMaxTemperature = getTreeMaxTemperature(i);

    // asegurar que el arbol pueda soportar las temperaturas minimas y maximas
    if(treeMinTemperature > cityMinTemperature || treeMaxTemperature < cityMaxTemperature) {
      treesToPlant.push(trees[i].nombre);
    }

  }

  return treesToPlant;

}

function isValidCode(code) {
  return code.length === 5;
}

function isCityValid(city) {
  
  for(let i = 0; i < ciudades.length; i++) {
    if(ciudades[i] === city.toLowerCase()) {
      return true;
    }
  }

  return false;
}

function getCity() {
  return document.querySelector('.city-input').value; 
}

function getCode() {
  return document.querySelector('.postal-code-input').value;
}

async function displayMap(coords) {
  // Crea el div para el mapa dinámicamente y configúralo
  const mapContainer = document.createElement('div');
  mapContainer.classList.add('map-container');
  document.body.appendChild(mapContainer);

  // Inicializa el mapa en el div recién creado y céntralo en las coordenadas especificadas
  const map = L.map(mapContainer).setView(coords, 13);

  // Agrega las teselas de OpenStreetMap al mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Añade un marcador en las coordenadas
  L.marker(coords).addTo(map)
      .bindPopup('¡Esta es tu ubicación seleccionada!')
      .openPopup();
}

async function showTreeResults() {

  const code = getCode();
  const city = getCity();

  if(!isCityValid(city)) {
    const text = document.createElement('h1');
    text.innerText = 'Ciudad no valida!!';
    document.body.append(text);
    return; // the next code wont execute
  }

  // is the code is not valid
  if(!isValidCode(code)) {
    const text = document.createElement('h1');
    text.innerText = 'Codigo postal no valido!!';
    document.body.append(text);
    return; // the next code wont execute
  }
  
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