function drawScatterplot(data) {
    // Remove an existing scatterplot before drawing again.
    d3.select("#scatterplot").selectAll("svg").remove();

    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Scatterplot of TV energy consumption against star rating, coloured by screen technology"
        );

    // Use the shared variable declared in shared-constants.js.
    innerChartS = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    // Horizontal position: star rating.
    xScaleS
        .domain([0, d3.max(data, d => d.star)])
        .range([0, innerWidth])
        .nice();

    // Vertical position: annual energy consumption.
    yScaleS
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([innerHeight, 0])
        .nice();

    // Different colours for different screen technologies.
    colorScale
        .domain(data.map(d => d.screenTech))
        .range(d3.schemeCategory10);

    // Draw one circle per TV model.
    innerChartS.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // Bottom axis.
    innerChartS.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(
            d3.axisBottom(xScaleS)
                .ticks(8)
                .tickFormat(d3.format("d"))
        );

    // Left axis.
    innerChartS.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(yScaleS).ticks(7));

    // Horizontal axis label.
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    // Vertical axis label.
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("Labelled energy consumption (kWh/year)");

    // Legend in the top-right corner.
    const legend = svg.append("g")
        .attr(
            "transform",
            `translate(${width - 100}, ${margin.top})`
        );

    colorScale.domain().forEach((screenTech, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(screenTech));

        legendRow.append("text")
            .attr("x", 18)
            .attr("y", 5)
            .attr("dominant-baseline", "middle")
            .attr("fill", "currentColor")
            .attr("font-size", 12)
            .text(screenTech);
    });
}