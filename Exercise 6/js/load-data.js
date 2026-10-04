document.addEventListener("DOMContentLoaded", () => {
    d3.csv("data/Ex6_TVdata_withStar.csv", d => {
        return {
            brand: d.brand,
            model: d.model,
            screenSize: +d.screenSize,
            screenTech: d.screenTech,
            star: +d.star,
            energyConsumption: +d.energyConsumption
        };
    }).then(data => {
        console.log("TV data:", data);
        console.log("Number of TV models:", data.length);

        drawHistogram(data);
        populateFilters(data);
    }).catch(error => {
        console.error("Error loading or drawing histogram:", error);
    });
});