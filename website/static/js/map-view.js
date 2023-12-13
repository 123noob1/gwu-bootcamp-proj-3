// Promise pending
const dataPromiseMap = d3.json(data, d3.autoType);

// Create starting coords and zoom
const startingCoords = [40.70544486444615, -73.99429321289062];
const zoomLevel = 13;

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Start the population of different chain shop layers and setting custom marker colors
dataPromiseMap.then( data => {
    // Code goes here
});