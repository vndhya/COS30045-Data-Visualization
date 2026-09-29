// Display the current year in the footer.
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Find all FAQ question buttons.
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        // Find the answer connected to this button.
        const answerId = button.getAttribute("aria-controls");
        const answer = document.getElementById(answerId);

        // Check whether the answer is currently open.
        const isOpen = button.getAttribute("aria-expanded") === "true";

        // Switch between open and closed.
        button.setAttribute("aria-expanded", String(!isOpen));
        answer.hidden = isOpen;
    });
});

// Run the calculator code only on pages containing its form.
const energyForm = document.getElementById("energy-form");

if (energyForm) {
    const wattsInput = document.getElementById("watts");
    const hoursInput = document.getElementById("hours");
    const priceInput = document.getElementById("price");
    const error = document.getElementById("calculator-error");
    const results = document.getElementById("calculator-results");

    function calculateEnergy(watts, hours, price) {
        const daily = (watts / 1000) * hours;
        const monthly = daily * 30;
        const yearly = daily * 365;

        // Convert cents to Australian dollars.
        const monthlyCost = monthly * (price / 100);
        const yearlyCost = yearly * (price / 100);

        return { daily, monthly, yearly, monthlyCost, yearlyCost };
    }

    energyForm.addEventListener("submit", function (event) {
        // Prevent the form from reloading the page.
        event.preventDefault();

        error.textContent = "";
        results.textContent = "";

        // Check for empty fields before converting to numbers.
        if (
            wattsInput.value.trim() === "" ||
            hoursInput.value.trim() === "" ||
            priceInput.value.trim() === ""
        ) {
            error.textContent = "Please enter a number in all three fields.";
            return;
        }

        const watts = Number(wattsInput.value);
        const hours = Number(hoursInput.value);
        const price = Number(priceInput.value);

        if (
            !Number.isFinite(watts) ||
            !Number.isFinite(hours) ||
            !Number.isFinite(price)
        ) {
            error.textContent = "Please enter valid numbers in all fields.";
            return;
        }

        if (watts <= 0) {
            error.textContent = "Power usage must be greater than 0 watts.";
            return;
        }

        if (hours < 0 || hours > 24) {
            error.textContent = "Hours used per day must be between 0 and 24.";
            return;
        }

        if (price < 0) {
            error.textContent = "Electricity price cannot be negative.";
            return;
        }

        const energy = calculateEnergy(watts, hours, price);

        if (!Object.values(energy).every(Number.isFinite)) {
            error.textContent = "These values are too large. Please use smaller numbers.";
            return;
        }

        // Replace previous results instead of adding duplicates.
        results.innerHTML = `
            <h3>Estimated results</h3>
            <p>Daily energy: <strong>${energy.daily.toFixed(2)} kWh</strong></p>
            <p>Monthly energy (30 days): <strong>${energy.monthly.toFixed(2)} kWh</strong></p>
            <p>Yearly energy (365 days): <strong>${energy.yearly.toFixed(2)} kWh</strong></p>
            <p>Monthly cost: <strong>AUD $${energy.monthlyCost.toFixed(2)}</strong></p>
            <p>Yearly cost: <strong>AUD $${energy.yearlyCost.toFixed(2)}</strong></p>
        `;
    });

    // Clear old estimates when inputs change.
    energyForm.addEventListener("input", function () {
        error.textContent = "";
        results.textContent = "Click Calculate to update your results.";
    });
}