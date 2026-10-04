// Load the data and convert Count to a number.
d3.csv("data/tvSizes.csv", d => {
    return {
        Screensize_Category: d.Screensize_Category,
        Count: +d.Count
    };
}).then(data => {
    console.log(data);

    drawDonutChart(data);
}).catch(error => {
    console.error("Error loading donut chart:", error);
});

function drawDonutChart(data) {
    // Set up chart dimensions.
    const width = 1000;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 20;

    // Assign a colour to each category.
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.Screensize_Category))
        .range(d3.schemeSet2);

    // Calculate slice angles and preserve the CSV order.
    const pie = d3.pie()
        .value(d => d.Count)
        .sort(null);

    // Set the inner and outer radius of the donut.
    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    // Create the SVG canvas.
    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background-color", "white")
        .style("font-family", "Arial, sans-serif");

    // Move the chart's origin to the centre.
    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${width / 2}, ${height / 2})`
        );

    const slices = pie(data);

    // Draw one arc for each category.
    innerChart.selectAll(".donut-slice")
        .data(slices)
        .join("path")
        .attr("class", "donut-slice")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.Screensize_Category))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Position each label in the middle of its slice.
    innerChart.selectAll(".donut-label")
        .data(slices)
        .join("text")
        .attr("class", "donut-label")
        .attr(
            "transform",
            d => `translate(${arcGenerator.centroid(d)})`
        )
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .style("font-size", "16px")
        .text(d => d.data.Screensize_Category);
}