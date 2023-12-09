const newdat = "coffeeshops.json";
    d3.json(newdat).then(function(data) {
        console.log(data);
    });