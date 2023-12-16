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
    // markerLists will be used to generate the legends
    let layers = {};
    let layersList = [];
    let overlays = {};
    let icons = {};
    let markerLists = [];

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
                if (counter == 0) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'blue',
                        shape: 'square'
                    });
                } else if (counter == 1) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'red',
                        shape: 'square'
                    });
                } else if (counter == 2) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'yellow',
                        shape: 'square'
                    });
                } else if (counter == 3) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'orange-dark',
                        shape: 'square'
                    });
                } else if (counter == 4) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'pink',
                        shape: 'square'
                    });
                } else if (counter == 5) {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'black',
                        shape: 'square'
                    });
                } else {
                    icons[item.name] = L.ExtraMarkers.icon({
                        icon: 'ion-coffee',
                        iconColor: 'white',
                        markerColor: 'cyan',
                        shape: 'square'
                    });
                };
                counter += 1;
            };
        };
    });

    console.log(layersList);
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

    // Create a legend to display information about our map.
    let info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend".
    info.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        return div;
    };

    // Add the info legend to the map.
    info.addTo(map);

    // Loop through the dataset to append new markers
    data.forEach(d => {
        // Append the coffee chain name to the list if it hasn't been added in order of the dataset which will match with what we see in the
        // overlays
        if (!markerLists.includes(d.name)) { markerLists.push(d.name)};

        // Bulid up the address
        let popUpBuilder = d.address1 + ' ' + d.address2 + ' ' + d.address3 + ', ' + d.city + ', ' + d.state + ' ' + d.zip;
        
        // Remove excess spaces
        popUpBuilder = popUpBuilder.replaceAll('  , ', ', ').replaceAll(' , ', ', ');

        // Finish up the popup builder
        popUpBuilder =  '<table class="table table-hover table-borderless leafpad" style="font-size: small;">' +
                            '<tr><img src="' + d.image_url + '" class="imgcrop border rounded"></tr>' + 
                            '<tr>' +
                                '<td style="width: 125px;"><b>Coffeeshop Name</b></td>' +
                                '<td><a href="' + d.url + '" target="_blank" title="Click to go to Yelp\'s page">' + d.name + '</a></td>' +
                            '<tr>' +
                            '<tr>' +
                                '<td><b>Address</b></td>' +
                                '<td>' + popUpBuilder + '</td>' +
                            '<tr>' +
                            '<tr>' +
                                '<td><b>Phone Number</b></td>' +
                                '<td>' + d.display_phone + '</td>' +
                            '<tr>' +
                            '<tr>' +
                                '<td><b>Price</b></td>' +
                                '<td>' + d.price + '</td>' +
                            '<tr>' +
                            '<tr>' +
                                '<td><b>Rating</b></td>' +
                                '<td>' + d.rating + '</td>' +
                            '<tr>' +
                            '<tr>' +
                                '<td><b>Review Counts</b></td>' +
                                '<td>' + d.review_count + '</td>' +
                            '<tr>' +
                        '</table>'
        
        let newMarker = L.marker([d.latitude, d.longitude], {icon: icons[d.name]});
        newMarker.addTo(layers[d.name]);
        newMarker.bindPopup(popUpBuilder);
    });

    // Show the legends
    updateLegend(markerLists);
});

// Update legend
function updateLegend(markerItems) {
    let legendContainerList = [];

    // Loop through the markerItems to generate the container list for showing in the legend
    for (i in markerItems) {
        if (i == 0) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: #0047AB; color: white; text-indent: 0.2em;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else if (i == 1) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: #9A2A2A; color: white; text-indent: 0.2em;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else if (i == 2) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: yellow; color: black; text-indent: 0.2em; font-weight: bold;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else if (i == 3) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: #d73e29; color: white; text-indent: 0.2em;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else if (i == 4) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: #c057a0; color: white; text-indent: 0.2em;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else if (i == 5) {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: black; color: white; text-indent: 0.2em;">☕ ' + markerItems[i] + '</td></tr><tr style="height:3px;"></tr>');
        } else {
            legendContainerList.push('<tr><td style="border-radius: 3px; background-color: cyan; color: black; text-indent: 0.2em; font-weight: bold;">☕ ' + markerItems[i] + '</td></tr>');
        }
    };

    document.querySelector('.legend').innerHTML = '<table class="table table-hover table-borderless leafpad" style="background-color: white; width: 150px;">' + legendContainerList.join("") + '</table>'
}