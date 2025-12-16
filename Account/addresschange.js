// function onLoad(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var country = formContext.getAttribute("cms_country").getValue();
 
//     // Disable State & City if country not selected
//     if (country == null) {
//         formContext.getControl("cms_state").setDisabled(true);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
// }

// function onCountryChange(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var country = formContext.getAttribute("cms_country").getValue();
 
//     if (country == null) {
//         // Clear & disable State & City
//         formContext.getAttribute("cms_state").setValue(null);
//         formContext.getAttribute("cms_city").setValue(null);
 
//         formContext.getControl("cms_state").setDisabled(true);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
//     else {
//         // Enable State when country selected
//         formContext.getControl("cms_state").setDisabled(false);
//     }
// }
 
// function onStateChange(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var state = formContext.getAttribute("cms_state").getValue();
 
//     if (state == null) {
//         // Clear & disable city
//         formContext.getAttribute("cms_city").setValue(null);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
//     else {
//         // Enable city
//         formContext.getControl("cms_city").setDisabled(false);
//     }
// }


// function onLoadcontact(executionContext) {
//     var formContext = executionContext.getFormContext();
    
    
//     var country = formContext.getAttribute("cms_country").getValue();
 
//     // Disable State & City if country not selected
//     if (country == null) {
//         formContext.getControl("cms_state").setDisabled(true);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
// }

// function onCountryChangecontact(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var country = formContext.getAttribute("cms_country").getValue();
 
//     if (country == null) {
//         // Clear & disable State & City
//         formContext.getAttribute("cms_state").setValue(null);
//         formContext.getAttribute("cms_city").setValue(null);
 
//         formContext.getControl("cms_state").setDisabled(true);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
//     else {
//         // Enable State when country selected
//         formContext.getControl("cms_state").setDisabled(false);
//     }
// }
 
// function onStateChangecontact(executionContext) {
//     var formContext = executionContext.getFormContext();
//     var state = formContext.getAttribute("cms_state").getValue();
 
//     if (state == null) {
//         // Clear & disable city
//         formContext.getAttribute("cms_city").setValue(null);
//         formContext.getControl("cms_city").setDisabled(true);
//     }
//     else {
//         // Enable city
//         formContext.getControl("cms_city").setDisabled(false);
//     }
// }


var AddressReverse = {

    onLoad: function (executionContext) {
        var formContext = executionContext.getFormContext();

        // Lock State & Country on load
        formContext.getControl("cms_state").setDisabled(true);
        formContext.getControl("cms_country").setDisabled(true);
    },

    onCityChange: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var city = formContext.getAttribute("cms_city").getValue();

        if (!city) {
            // Clear & lock State and Country
            formContext.getAttribute("cms_state").setValue(null);
            formContext.getAttribute("cms_country").setValue(null);

            formContext.getControl("cms_state").setDisabled(true);
            formContext.getControl("cms_country").setDisabled(true);
            return;
        }

        var cityId = city[0].id.replace(/[{}]/g, "");

        // 1️⃣ Get State from City
        Xrm.WebApi.retrieveRecord("cms_city", cityId, "?$select=_cms_state_value").then(
            function (cityResult) {

                if (!cityResult._cms_state_value) return;

                var stateId = cityResult._cms_state_value;

                // Set State
                formContext.getAttribute("cms_state").setValue([{
                    id: stateId,
                    name: cityResult["_cms_state_value@OData.Community.Display.V1.FormattedValue"],
                    entityType: "cms_state"
                }]);

                // 2️⃣ Get Country from State
                Xrm.WebApi.retrieveRecord("cms_state", stateId, "?$select=_cms_country_value").then(
                    function (stateResult) {

                        if (!stateResult._cms_country_value) return;

                        var countryId = stateResult._cms_country_value;

                        formContext.getAttribute("cms_country").setValue([{
                            id: countryId,
                            name: stateResult["_cms_country_value@OData.Community.Display.V1.FormattedValue"],
                            entityType: "cms_country"
                        }]);

                        // Lock both after setting
                        formContext.getControl("cms_state").setDisabled(true);
                        formContext.getControl("cms_country").setDisabled(true);
                    }
                );
            }
        );
    }
};
