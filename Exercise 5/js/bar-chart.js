// Load data and convert energy consumption to a number.
d3.csv("data/tvEnergy.csv", d => {
    return {
        Screen_Tech: d.Screen_Tech,
        Energy_Consumption:
            +d["Mean(Labelled energy consumption (kWh/year))"]
    };
}).then(data => {
    // Sort from highest to lowest energy consumption.
    data.sort((a, b) =>
        b.Energy_Consumption - a.Energy_Consumption
    );

    console.log(data);
    drawBarChart(data);
}).catch(error => {
    console.error("Error:", error);
});

function drawBarChart(data) {
    // Set up margins and dimensions.
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
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background-color", "white")
        .style("color", "black")
        .style("font-family", "Arial, sans-serif");

    // Position the chart inside the margins.
    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    // Categories go along the horizontal axis.
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, innerWidth])
        .padding(0.1);

    // Energy values go along the vertical axis.
    // Extra space above the maximum leaves room for labels.
    const yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.Energy_Consumption) * 1.1
        ])
        .nice()
        .range([innerHeight, 0]);

    // Create the axes.
    const bottomAxis = d3.axisBottom(xScale)
        .tickSize(0)
        .tickPadding(12)
        .tickFormat(d => d.toUpperCase());

    const leftAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSizeOuter(0);

    // Add the bottom axis.
    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis)
        .style("font-size", "14px");

    // Add the left axis.
    innerChart.append("g")
        .call(leftAxis)
        .style("font-size", "12px");

    // Add the y-axis label above the chart.
    innerChart.append("text")
        .attr("x", -margin.left + 10)
        .attr("y", -25)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .style("font-size", "16px")
        .text("Mean energy consumption (kWh/year)");

    // Draw the vertical bars.
    innerChart.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", d => yScale(d.Energy_Consumption))
        .attr("width", xScale.bandwidth())
        .attr(
            "height",
            d => innerHeight - yScale(d.Energy_Consumption)
        )
        .attr("fill", "green");

    // Add rounded energy values above the bars.
    innerChart.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr(
            "x",
            d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2
        )
        .attr("y", d => yScale(d.Energy_Consumption) - 8)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "14px")
        .text(d => `${Math.round(d.Energy_Consumption)} kWh/year`);
}