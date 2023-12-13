// Promise pending
const dataPromiseMap = d3.json(data, d3.autoType);

// Create starting coords and zoom
const startingCoords = [40.70544486444615, -73.99429321289062];
const zoomLevel = 11;

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map
let map = L.map('map-1', {
    center: startingCoords,
    zoom: zoomLevel
});

// Add "streetmap" tile layer to the map
streetmap.addTo(map);

// Empty marker which we will use to access and remove previous markers on shop change
var markers = [];
var shops;

// Mapping #1 (for the index.html page)
function setMapByShop(shopName) {

    // Code goes here
    
};