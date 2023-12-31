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

    // Loop through the dataset and create the markers
    dataPromiseMap.then(data => {

        // If layer group is defined/has a layer set up previously then delete and reset the markers list as well
        if (shops != undefined) {
            map.removeLayer(shops);
            markers = [];
        };

        // Iterate through each record and create a list of markers
        data.forEach(function(d) {
            if (d.name.toString() == shopName) {
                // Bulid up the address
                let popUpBuilder = d.address1 + ' ' + d.address2 + ' ' + d.address3 + ', ' + d.city + ', ' + d.state + ' ' + d.zip;
                
                // Remove excess spaces
                popUpBuilder = popUpBuilder.replaceAll('  , ', ', ').replaceAll(' , ', ', ');

                // Finish up the popup builder
                popUpBuilder =  '<table class="table table-hover table-borderless leafpad" style="font-size: small;">' +
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

                // Append the marker into the markers list
                markers.push(L.marker([d.latitude, d.longitude]).bindPopup(popUpBuilder))                
            };
        });

        // Add the markers to layer group and add it to the map
        shops = L.layerGroup(markers).addTo(map);
        map.flyTo(startingCoords, zoomLevel);
    });
};