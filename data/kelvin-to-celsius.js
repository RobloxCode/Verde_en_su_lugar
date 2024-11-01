export { getCelsius };

function getCelsius(kelvin) {
    return Math.round((kelvin - 273.15) * 100) / 100;
}