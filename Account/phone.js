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

    // 3️⃣ can not start with zero
    if (!/^[123456789]/.test(phoneValue)) {
        fail("Phone number can not start with zero.");
        return;
    }

    // 4️⃣ Cannot be all zeros
    if (/^0{10}$/.test(phoneValue)) {
        fail("Phone number cannot be all zeros.");
        return;
    }
}

// function validatePhoneNumber(executionContext)
// {
//     var formContext = executionContext.getFormContext()
//     var phoneField = formContext.getAttribute("telephone1")

//     if(!phoneField)
//         return 

//     var phoneValue = phoneField.getValue()
//     var eventArgs = executionContext.getEventArgs  &&  executionContext.getEventArgs()
    
//     formContext.ui.clearFormNotification("phone_error")

//     if (!phoneValue) {
//         return
//     }

//     function fail(msg)
//     {
//         formContext.ui.setNotification(msg, "ERROR", "phone_error")

//         phoneField.setValue(null)
//         phoneField.setSubmitMode("always")
//         alert(msg)
//         if(eventArgs && eventArgs.preventDefault)
//         {
//             eventArgs.preventDefault()
//         }
//     }
//     if(!/^[0-9]+$/.test(phoneValue))
//     {
//         fail("Phone number can contain only digits")
//         return
//     }
//     if(!phoneValue.length == 10)
//     {
//         fail("mobile number only contains digits")
//         return
//     }
//     if(!/^[123456789]/.test(phoneValue))
//     {
//         fail("can not start with zero")
//         return
//     }
//     if (/^0{10}$/.test(phoneValue)) {
//         fail("can not be all zeroes")
//         return
//     }
// }