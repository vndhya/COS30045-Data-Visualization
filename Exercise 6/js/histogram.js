function drawHistogram(data) {
    // Remove any previous histogram before drawing.
    d3.select("#histogram").selectAll("svg").remove();

    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    // Generate bins from the TV data.
    const bins = binGenerator(data);
    console.log("Histogram bins:", bins);

    // Find the bin boundaries and largest frequency.
    const minEng = bins[0].x0;
    const maxEng = bins[bins.length - 1].x1;
    const binsMaxLength = d3.max(bins, d => d.length);

    console.log("Bin limits and maximum frequency:", {
        minEng,
        maxEng,
        binsMaxLength
    });

    // Set scale domains and ranges.
    xScale
        .domain([minEng, maxEng])
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice();

    // Draw the histogram bars.
    innerChart.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    // Add the bottom axis.
    innerChart.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    // Add the left axis.
    innerChart.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(yScale).ticks(7));

    // Label the horizontal axis.
    innerChart.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Labelled energy consumption (kWh/year)");

    // Label the vertical axis.
    innerChart.append("text")
        .attr("class", "axis-label")
        .attr("x", -margin.left + 5)
        .attr("y", -15)
        .attr("text-anchor", "start")
        .text("Frequency");
}