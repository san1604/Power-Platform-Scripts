function validatePhoneNumber(executionContext) {
    var formContext = executionContext.getFormContext();
    var phoneField = formContext.getAttribute("telephone1");

    if (!phoneField) return;

    var phoneValue = phoneField.getValue();
    var eventArgs = executionContext.getEventArgs && executionContext.getEventArgs();

    // Clear old notifications
    formContext.ui.clearFormNotification("phone_error");

    // If empty → skip validation
    if (!phoneValue) {
        return;
    }

    // Helper: show error, clear field, block save
    function fail(msg) {
        formContext.ui.setFormNotification(msg, "ERROR", "phone_error");

        // Clear field value (works on mobile too)
        phoneField.setValue(null);
        phoneField.setSubmitMode("always");

        // Give user feedback
        alert(msg);

        // Stop Save if triggered from OnSave
        if (eventArgs && eventArgs.preventDefault) {
            eventArgs.preventDefault();
        }
    }

    // 1️⃣ Only digits
    if (!/^[0-9]+$/.test(phoneValue)) {
        fail("Phone number can contain digits only.");
        return;
    }

    // 2️⃣ Must be exactly 10 digits
    if (phoneValue.length !== 10) {
        fail("Phone number must be exactly 10 digits.");
        return;
    }

    // 3️⃣ Must start with 6/7/8/9
   

    // 4️⃣ Cannot be all zeros
    if (/^0{10}$/.test(phoneValue)) {
        fail("Phone number cannot be all zeros.");
        return;
    }
}