// Shared chart dimensions.
const margin = {
    top: 40,
    right: 30,
    bottom: 50,
    left: 70
};

const width = 800;
const height = 400;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Colours match the CSS.
const barColor = "#ff9ed1";
const bodyBackgroundColor = "#121014";

// Shared scales.
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Group TVs into energy consumption bins.
const binGenerator = d3.bin()
    .value(d => d.energyConsumption);