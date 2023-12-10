// Promise pending
const dataPromise = d3.json(data, d3.autoType);
console.log(dataPromise);

// Setup the Overall Shop Info
function setShopInfo(shopName) {
    // Select the shop info row id tags
    let rowShop = d3.select('#shops-found');
    let rowReviewCount = d3.select('#review-counts');
    let rowAverageRating = d3.select('#average-rating');
    let rowAveragePrice = d3.select('#average-price');

    // Reset the content inside the row cell values
    rowShop.text('');
    rowReviewCount.text('');
    rowAverageRating.text('');
    rowAveragePrice.text('');

    // Using json object dataPromise to populate the shop chain info in the shop information section
    dataPromise.then(data => {
        let totalShop = 0;
        let totalReview = 0;
        let avgRating = 0.0;
        let avgPrice = 0.0;

        // Loop through each index of the list and return only unique value for the name of the shop
        data.forEach((item, index) => {
            if (item.name.toString() === shopName) {
                totalShop += 1
                totalReview += item.review_count
                avgRating += item.rating
                avgPrice += item.price_point
            };
        });

        // Populate the results
        rowShop.text(totalShop);
        rowReviewCount.text(totalReview);
        rowAverageRating.text(Math.round((avgRating / totalShop)*10)/10);

        // Determine the price based on averaged price point
        switch(Math.round(avgPrice/totalShop)) {
            case 0:
            case 1:
                rowAveragePrice.text('$');
                break;
            case 2:
                rowAveragePrice.text('$$');
                break;
            case 3:
                rowAveragePrice.text('$$$');
                break;
            case 4:
                rowAveragePrice.text('$$$$');
        }
    });
};

// When the dropdown selection changes
function optionChanged(shopName) {
    setShopInfo(shopName);
    // setPlots(shopId);
};

// Starter/init function
function init() {
    // Set the dropdown list then append the unique names of the chain coffee shops
    let selMenu = d3.select('#selDataset');

    // Using json object dataPromise to populate the item values for sample Id
    dataPromise.then(data => {
        let names = [];
        
        // Loop through each index of the list and return only unique value for the name of the shop
        data.forEach((item, index) => {
            if (!names.includes(item.name)) {
                names.push(item.name)
            };
        });

        Object.values(names).forEach(value => {
            selMenu.append('option').attr('value', value).text(value);
        });

        // Call optionChanged to fill the page with the defaulted sample Id
        optionChanged(selMenu.property('value'));
    });
};

init();