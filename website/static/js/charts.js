// Promise pending
const dataPromiseChart = d3.json(data, d3.autoType);

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

    // Using json object dataPromiseChart to populate the shop chain info in the shop information section
    dataPromiseChart.then(data => {
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

// Function for plotting the charts
function setPlots(shopName) {
    // Codes go here
    dataPromiseChart.then(data => {
        // Get current selected shop return in a descending order based on review count
        let shopSorted = data.filter((item, index) => {
                if (item.name.toString() === shopName) {
                    let sortByReviewCount = data.sort((x, y) => { return y.review_count - x.review_count });
                    return sortByReviewCount;
                };
            });
        
        // Resort one more time since some shops didn't sort correctly the first time
        shopSorted = shopSorted.sort((x, y) => { return y.review_count - x.review_count });

        // Set up the HBar to display top 10 based on review counts for the seleted shop
        let yValues = shopSorted.slice(0, 10).map(v => v.id);
        let shopLabels = shopSorted.slice(0, 10).map(v => {
            let label = '<b>Address:</b><br>   ' + v.address1 + ' ' + v.address2 + ' ' + v.address3 + '<br>   ' + v.city + ', ' + v.state + ' ' + v.zip + '<br>' +
                        '<b>Phone Number:</b> ' + v.display_phone + '<br>' +
                        '<b>Price:</b> ' + v.price
            return label;
        });

        // Set up the review count
        let barReviewCount = {
            x: yValues,
            y: shopSorted.slice(0, 10).map(v => v.review_count),
            name: 'Review Count',
            text: shopLabels,
            type: 'bar',
            marker: { color: 'rgba(55, 128, 191, 1)' }
        };

        // Set up the rating
        let barRatingCount = {
            x: yValues,
            y: shopSorted.slice(0, 10).map(v => v.rating),
            yaxis: 'y2',
            name: 'Rating',
            type: 'bar',
            marker: { color: 'rgba(255, 0, 0, 0.5)' }
        };

        // Group the traces
        let barGroup1 = [barReviewCount, barRatingCount];

        // Set the layout for the HBar chart
        let layout1 = {
            title: {
                text: '<b>Top 10 ' + shopName + ' Shops with Review Counts and Ratings</b>',
                xref: 'paper',
                font: { size: 14 }
            },
            hoverlabel: { align: 'left' },
            xaxis: { 
                showticklabels: true,
                tickfont: {
                  size: 9
                },
            },
            yaxis: {
                mirrow: true,
                side: 'left'
            },
            yaxis2: { 
                side: 'right',
                range: [0, 5],
                overlaying: 'y',
                showgrid: true
            },
            showlegend: true,
            legend: { 
                orientation: 'h',
                y: 1.15,
                x: 0.25,
                bgcolor: 'rgba(255, 255, 255, .5)',
                font: { size: 12 }
            },
            margin: {
                t: 50,
                pad: 4
            }
        };

        // Plot the first chart
        Plotly.newPlot('bar1', barGroup1, layout1, {displayModeBar: false});

        // Set up a bar chart to show all shops with the main selected shop colorized        
        let shopStatistic = {};
        let shopNames = [];
        let shopTotalReviewCount = [];
        let shopAvgRating = [];
        let reviewCountColor = [];
        let avgRatingColor = [];

        // Get total review counts by each shop by aggregation
        data.forEach(function(d) {
            if (shopStatistic.hasOwnProperty(d.name)) {
                shopStatistic[d.name] = [
                    shopStatistic[d.name][0] + d.review_count,
                    shopStatistic[d.name][1] + d.rating,
                    shopStatistic[d.name][2] + 1
                ];
            } else {
                shopStatistic[d.name] = [
                    d.review_count,
                    d.rating,
                    1
                ];
            };
        });

        // Loop through the shopStatistic to assign the x (shop name), y1 (total review count), and y2 (average rating) values
        for (key in shopStatistic) {
            shopNames.push(key);
            shopTotalReviewCount.push(shopStatistic[key][0]);
            shopAvgRating.push(Math.round((shopStatistic[key][1] / shopStatistic[key][2])*10)/10);
        };

        // Define custom alpha where the selected shop will be 1 while the rest 0.5 (adjust accordingly)
        for (i in shopNames) {
            if (shopNames[i] == shopName) {
                avgRatingColor.push('rgba(255, 0, 0, .5)')
                reviewCountColor.push('rgba(55, 128, 191, 1)')
            } else {
                avgRatingColor.push('rgba(255, 0, 0, 0.15)')
                reviewCountColor.push('rgba(55, 128, 191, .15)')
            };
        };

        let barTotalReviewCount = {
            x: shopNames,
            y: shopTotalReviewCount,
            type: 'bar',
            name: 'Review Counts',
            text: shopTotalReviewCount.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: { color: reviewCountColor }
        };

        let barTotalRatingCount = {
            x: shopNames,
            y: shopAvgRating,
            yaxis: 'y2',
            type: 'bar',
            name: 'Average Rating',
            text: shopAvgRating.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: { color: avgRatingColor }
        };

        let barGroup2 = [barTotalReviewCount, barTotalRatingCount];

        let layout2 = {
            showlegend: false,
            yaxis: {
                mirrow: true,
                side: 'left'
            },
            yaxis2: { 
                side: 'right',
                range: [0, 5],
                overlaying: 'y',
                showgrid: true
            },
            title: {
                text: '<b>Review Counts and Average Rating by Coffee Chain</b>',
                xref: 'paper',
                font: { size: 14 }
            },
            margin: { 
                t: 50,
                pad: 4 
            }
        };

        Plotly.newPlot('bar2', barGroup2, layout2, {displayModeBar: false});
    });
};

// When the dropdown selection changes
function optionChanged(shopName) {
    setShopInfo(shopName);
    setPlots(shopName);

    // We're able to call this function from the map-main.js since the index.html is connecting
    // these js files together
    setMapByShop(shopName);
};

// Starter/init function
function init() {
    // Set the dropdown list then append the unique names of the chain coffee shops
    let selMenu = d3.select('#selDataset');

    // Using json object dataPromiseChart to populate the item values for sample Id
    dataPromiseChart.then(data => {
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