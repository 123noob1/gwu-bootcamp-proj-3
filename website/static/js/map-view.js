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
    // Initialize all the LayerGroups that we'll use.
    let layers = {};
    let layersList = [];
    let overlays = {};
    let icons = {};

    // Counter to adjust the color
    let counter = 0;

    // Loop through the dataset and insert the shop names and create blank layers and overlays for each shop
    // so if in future we add more shops then they will also be included
    data.forEach((item, index) => {
        if (!layers.hasOwnProperty(item.name)) {
            layers[item.name] = new L.layerGroup();
            layersList.push(layers[item.name]);
            overlays[item.name] = layers[item.name];
            
            // Assign default 1-6 colors and whatever else added will be randomized
            if (!icons.hasOwnProperty(item.name)) {
                console.log('inside create icon template by layer ' + item.name)
                if (counter == 0) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'blue'
                    });
                } else if (counter == 1) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'red'
                    });
                } else if (counter == 2) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'yellow'
                    });
                } else if (counter == 3) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'orange'
                    });
                } else if (counter == 4) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'black'
                    });
                } else if (counter == 5) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markercolor: 'pink'
                    });
                } else {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'cyan'
                    });
                };
                counter += 1;
            };
        };
    });

    console.log(icons);

    // Create the map
    let map = L.map('map-2', {
        center: startingCoords,
        zoom: zoomLevel,
        layers: layersList
    });

    // Add "streetmap" tile layer to the map
    streetmap.addTo(map);

    // Create a control for our layers, and add our overlays to it.
    L.control.layers(null, overlays).addTo(map);

    // Loop through the dataset to append new markers
    data.forEach(d => {
        // Bulid up the address
        let popUpBuilder = d.address1 + ' ' + d.address2 + ' ' + d.address3 + ', ' + d.city + ', ' + d.state + ' ' + d.zip;
        
        // Remove excess spaces
        popUpBuilder = popUpBuilder.replaceAll('  , ', ', ').replaceAll(' , ', ', ');

        // Finish up the popup builder
        popUpBuilder = '<b>Coffeeshop Name:</b> ' + d.name + '<br>' +
                        '<b>Address:</b> ' + popUpBuilder + '<br>' +
                        '<b>Phone Number:</b> ' + d.display_phone + '<br>' +
                        '<b>Price:</b> ' + d.price + '<br>' +
                        '<b>Rating:</b> ' + d.rating
        
        let newMarker = L.marker([d.latitude, d.longitude], {icon: icons[d.name]});
        newMarker.addTo(layers[d.name]);
        newMarker.bindPopup(popUpBuilder);
    });
});