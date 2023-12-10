// Promise pending
const dataPromise = d3.json(data, d3.autoType);
console.log(dataPromise);

// Function for mapping
// Mapping #1 (for the index.html page)
function setMapByShop(shopName) {
    // Codes go here
};

// Mapping #2 (for the map.html page)
function setMapAll() {
    // Codes go here
};

// When the dropdown selection changes
function optionChanged(shopName) {
    setMap(shopName);
};

// Starter/init function
function init() {
    // Call optionChanged to fill the page with the defaulted sample Id
    optionChanged(selMenu.property('value'));
};

init();