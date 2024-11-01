import { ciudades } from "./data/ciudades.js";
import { getCelsius } from "./data/kelvin-to-celsius.js";

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
  const weatherData = await getWeatherData();
  console.log(weatherData);

  const div = document.createElement('div');
  div.classList.add('data-container');
  div.innerHTML = `

    <div class="data-container">

      <div class="weather-info-container">

        <img src="tree-photos/flag-photo/cloud.png" class="cloud-image">

        <div>
          <p class="city-name">${weatherData.name} MX <img src="tree-photos/flag-photo/mx-flag.png" alt=""></p>
        </div>
        

        <div class="temperature-info-container">
          <p class="temperature-container">${Math.round(getCelsius(weatherData.main.temp))}°C</p>
          <p class="info-container">temperatura desde ${getCelsius(weatherData.main.temp_min)} hasta ${Math.round(getCelsius(weatherData.main.temp_max))}°, viento ${weatherData.wind.speed} m/s. Nubes ${weatherData.clouds.all}%</p>
        </div>

        <div>
          <p class="coords-container">cordenadas geo. [${weatherData.coord.lat} , ${weatherData.coord.lon}]</p>
        </div>

      </div>

    </div>

  `;

  const divInfo = document.querySelector('.weather-info-container-div');
  divInfo.append(div);  

}

function isValidCode(code) {
  return code.length === 5;
}

function isCityValid(city) {
  
  for(let i = 0; i < ciudades.length; i++) {
    if(ciudades[i] == city.toLowerCase()) {
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

function showResults() {

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

  // only appending it once
  if(!document.querySelector('.result-text')) {

    const treesContainer = document.querySelector('.trees-container');
    const h1 = document.createElement('h1');
    h1.classList.add('result-text');
    h1.innerText = 'En tu localidad puedes plantar:';

    const div1 = document.createElement('div');
    div1.classList.add('tree-photo-container');
    div1.innerHTML = `
      <h2 class="tree-name">Jacaranda</h2>
      <img src="tree-photos/jacaranda.jpg" class="tree-photo photo-1">
    `;

    const div2 = document.createElement('div');
    div2.classList.add('tree-photo-container');
    div2.innerHTML = `
      <h2 class="tree-name">Fresno</h2>
      <img src="tree-photos/fresno.jpg" class="tree-photo photo-2">
    `;

    const div3 = document.createElement('div');
    div3.classList.add('tree-photo-container');
    div3.innerHTML = `
      <h2 class="tree-name">Eucalipto</h2>
      <img src="tree-photos/eucalipto.jpg" class="tree-photo photo-3">
    `;

    treesContainer.append(h1);
    treesContainer.append(div1);
    treesContainer.append(div2);
    treesContainer.append(div3);

    // adding the event listener here cuz we make the images in here
    document.querySelector('.photo-1')
      .addEventListener('click', () => {
        takeToInfoPage('https://nuestraflora.com/c-arboles/arbol-de-jacaranda/');
    });
    
    document.querySelector('.photo-2')
      .addEventListener('click', () => {
        takeToInfoPage('https://nuestraflora.com/c-arboles/arbol-fresno/');
    });
    
    document.querySelector('.photo-3')
      .addEventListener('click', () => {
        takeToInfoPage('https://nuestraflora.com/c-arboles/tipos-de-eucalipto/');
    });

  }
}

function takeToInfoPage(link) {
  window.open(link, '_blank');
}

// NEED TO FIX THE ISSUE OF APPEARING THE TREES PHOTOS FIRST //
document.querySelector('.show-trees-button').addEventListener('click', async () => {
  await displayWeatherInfo();
  showResults();
});

document.querySelector('.city-input').addEventListener('keydown', async event => {
  if(event.key == 'Enter') {
    await displayWeatherInfo();
    showResults();
  }
});

document.querySelector('.postal-code-input').addEventListener('keydown', async event => {
  if(event.key == 'Enter') {
    await displayWeatherInfo();
    showResults();
  }
});