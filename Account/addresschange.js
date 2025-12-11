function onLoad(executionContext) {
    var formContext = executionContext.getFormContext();
 
    var country = formContext.getAttribute("cms_country").getValue();
 
    // Disable State & City if country not selected
    if (country == null) {
        formContext.getControl("cms_state").setDisabled(true);
        formContext.getControl("cms_city").setDisabled(true);
    }
}
 
function onCountryChange(executionContext) {
    var formContext = executionContext.getFormContext();
    var country = formContext.getAttribute("cms_country").getValue();
 
    if (country == null) {
        // Clear & disable State & City
        formContext.getAttribute("cms_state").setValue(null);
        formContext.getAttribute("cms_city").setValue(null);
 
        formContext.getControl("cms_state").setDisabled(true);
        formContext.getControl("cms_city").setDisabled(true);
    }
    else {
        // Enable State when country selected
        formContext.getControl("cms_state").setDisabled(false);
    }
}
 
function onStateChange(executionContext) {
    var formContext = executionContext.getFormContext();
    var state = formContext.getAttribute("cms_state").getValue();
 
    if (state == null) {
        // Clear & disable city
        formContext.getAttribute("cms_city").setValue(null);
        formContext.getControl("cms_city").setDisabled(true);
    }
    else {
        // Enable city
        formContext.getControl("cms_city").setDisabled(false);
    }
}