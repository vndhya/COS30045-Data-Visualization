function populateFilters(data) {
    // Preserve the bins used when drawing the full dataset.
    const originalBins = binGenerator(data);

    binGenerator
        .domain([
            originalBins[0].x0,
            originalBins[originalBins.length - 1].x1
        ])
        .thresholds(originalBins.slice(1).map(bin => bin.x0));

    const buttons = d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter")
        .classed("active", d => d.isActive)
        .attr("aria-pressed", d => String(d.isActive))
        .text(d => d.label)
        .on("click", (event, selectedFilter) => {
            // Nothing to change if this filter is already selected.
            if (selectedFilter.isActive) {
                return;
            }

            // Only one filter is active at a time.
            filters_screen.forEach(filter => {
                filter.isActive = filter.id === selectedFilter.id;
            });

            buttons
                .classed("active", d => d.isActive)
                .attr("aria-pressed", d => String(d.isActive));

            updateHistogram(selectedFilter.id);
        });

    function updateHistogram(filterId) {
        const updatedData = filterId === "all"
            ? data
            : data.filter(tv => tv.screenTech === filterId);

        const updatedBins = binGenerator(updatedData);

        console.log("Selected filter:", filterId);
        console.log("Number of matching TV models:", updatedData.length);

        d3.select("#histogram")
            .selectAll("rect.bar")
            .data(updatedBins)
            .interrupt()
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    }
}
// Create the scatterplot tooltip.
function createTooltip() {
    innerChartS.selectAll(".tooltip").remove();

    const tooltip = innerChartS.append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Pink background with rounded corners.
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.95);

    // Screen size will be inserted when hovering.
    tooltip.append("text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", bodyBackgroundColor)
        .style("font-size", "14px")
        .style("font-weight", "bold");
}

// Show and hide the tooltip when hovering over dots.
function handleMouseEvents() {
    const tooltip = innerChartS.select(".tooltip");

    innerChartS.selectAll("circle.dot")
        .on("mouseenter", (event, d) => {
            // Display this TV's screen size.
            tooltip.select("text")
                .text(d.screenSize);

            // Read the position of the hovered circle.
            const cx = +event.currentTarget.getAttribute("cx");
            const cy = +event.currentTarget.getAttribute("cy");

            // Centre the tooltip above the circle.
            // Keep it within the chart's left and right edges.
            const tooltipX = Math.max(
                0,
                Math.min(
                    innerWidth - tooltipWidth,
                    cx - tooltipWidth / 2
                )
            );

            let tooltipY = cy - tooltipHeight - 10;

            // Put it below the circle if there is no room above.
            if (tooltipY < 0) {
                tooltipY = cy + 10;
            }

            tooltip.interrupt();

            tooltip
                .attr(
                    "transform",
                    `translate(${tooltipX}, ${tooltipY})`
                )
                .raise()
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0);
        });
}