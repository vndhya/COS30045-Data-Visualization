// Create the SVG canvas.
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Load the CSV and convert count to a number.
d3.csv("data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count
    };
}).then(data => {
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));

    // Pass the loaded data to the chart function.
    drawBarChart(data);
}).catch(error => {
    console.error("Error:", error);
});

// We will build this function in the next exercise.
function drawBarChart(data) {
    const barHeight = 20;

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", d => {
            console.log(d);
            return `bar bar-${d.count}`;
        })
        .attr("width", d => d.count)
        .attr("height", barHeight)
        .attr("fill", "blue");
}