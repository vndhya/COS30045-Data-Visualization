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