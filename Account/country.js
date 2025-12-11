function validateCountry(executionContext) {
    var formContext = executionContext.getFormContext();
    var countryField = formContext.getAttribute("address1_country");

    if (!countryField) return;

    var value = countryField.getValue();
    var eventArgs = executionContext.getEventArgs();

    // Clear previous errors
    formContext.ui.clearFormNotification("country_error");

    // If empty → let user type first
    if (!value) {
        return;
    }

    // Normalize input
    var normalizedValue = value.trim().toLowerCase();

    // ❌ Only allow "india"
    if (normalizedValue !== "india" || normalizedValue !== "bharat") {
        formContext.ui.setFormNotification(
            "Country must be 'India' only.",
            "ERROR",
            "country_error"
        );

        // Stop the save (works on mobile too)
        if (eventArgs) {
            eventArgs.preventDefault();
        }

        return;
    }
}
