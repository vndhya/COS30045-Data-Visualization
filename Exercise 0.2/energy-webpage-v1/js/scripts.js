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