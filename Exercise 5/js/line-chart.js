// Load the CSV and convert both values to numbers.
d3.csv("data/ARE_Spot_Prices.csv", d => {
    return {
        year: +d.Year,
        averagePrice: +d["Average Price (notTas-Snowy)"]
    };
}).then(data => {
    // Keep the years in chronological order.
    data.sort((a, b) => a.year - b.year);

    console.log(data);

    drawLineChart(data);
}).catch(error => {
    console.error("Error loading line chart:", error);
});

function drawLineChart(data) {
    // Use the same dimensions and margins as the bar chart.
    const margin = {
        top: 60,
        right: 170,
        bottom: 45,
        left: 60
    };

    const width = 1000;
    const height = 500;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG canvas.
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background-color", "white")
        .style("color", "black")
        .style("font-family", "Arial, sans-serif");

    // Position the inner chart inside the margins.
    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    // Both year and average price use linear scales.
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .range([innerHeight, 0]);

    // Format years as integers without commas.
    const bottomAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));

    const leftAxis = d3.axisLeft(yScale);

    // Add the x-axis at the bottom.
    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis)
        .style("font-size", "12px");

    // Add the y-axis on the left.
    innerChart.append("g")
        .call(leftAxis)
        .style("font-size", "12px");

    // Add the y-axis label.
    innerChart.append("text")
        .attr("x", -margin.left + 10)
        .attr("y", -25)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .style("font-size", "16px")
        .text("Average electricity spot price ($/MWh)");

    // The line will be added in the next step.
}