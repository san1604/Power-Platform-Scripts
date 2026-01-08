function validatePhoneNumber(executionContext)
{
    var formContext = executionContext.getFormContext()
    var phoneField = formContext.getAttribute("telephone1")

    if(!phoneField)
        return 

    var phoneValue = phoneField.getValue()
    var eventArgs = executionContext.getEventArgs  &&  executionContext.getEventArgs()
    
    formContext.ui.clearFormNotification("phone_error")

    if (!phoneValue) {
        return
    }

    function fail(msg)
    {
        formContext.ui.setNotification(msg, "ERROR", "phone_error")

        phoneField.setValue(null)
        phoneField.setSubmitMode("always")
        alert(msg)
        if(eventArgs && eventArgs.preventDefault)
        {
            eventArgs.preventDefault()
        }
    }
    if(!/^[0-9]+$/.test(phoneValue))
    {
        fail("Phone number can contain only digits")
        return
    }
    if(!phoneValue.length == 10)
    {
        fail("mobile number only contains digits")
        return
    }
    if(!/^[123456789]/.test(phoneValue))
    {
        fail("can not start with zero")
        return
    }
    if (/^0{10}$/.test(phoneValue)) {
        fail("can not be all zeroes")
        return
    }
}