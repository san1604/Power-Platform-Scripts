window.onerror = function (error, formContext) {
    const errorLog = {
        cms_Name: errorName || error.name || "JavaScript Error",
        cms_errormessage: error.message,
        cms_stacktrace: error.stack || "",
        cms_source: 2, // JavaScript
        cms_entityname: formContext.data.entity.getEntityName(),
        cms_recordid: formContext.data.entity.getId(),
        cms_occurredon: new Date().toISOString()
    };

    Xrm.WebApi.createRecord("cms_errorlog", errorLog)
        .catch(e => console.error("Error logging failed", e));
};

var AddressReverse = {

    onLoad: function (executionContext) {
        var formContext = executionContext.getFormContext();

        try {
            // Lock State & Country on load
            formContext.getControl("cms_state").setDisabled(true);
            formContext.getControl("cms_country").setDisabled(true);

        } catch (e) {
            console.error("onLoad error:", e.message);
            onerror(e, formContext);
        }
    },

    onCityChange: function (executionContext) {
        var formContext = executionContext.getFormContext();

        try {
            var city = formContext.getAttribute("cms_city").getValue();

            // If City is cleared
            if (!city) {
                formContext.getAttribute("cms_state").setValue(null);
                formContext.getAttribute("cms_country").setValue(null);

                formContext.getControl("cms_state").setDisabled(true);
                formContext.getControl("cms_country").setDisabled(true);
                return;
            }

            var cityId = city[0].id.replace(/[{}]/g, "");

            // 🔹 Get State from City
            Xrm.WebApi.retrieveRecord(
                "cms_city",
                cityId,
                "?$select=_cms_state_value"
            ).then(
                function (cityResult) {
                    try {
                        if (!cityResult._cms_state_value) return;

                        var stateId = cityResult._cms_state_value;

                        // Set State
                        formContext.getAttribute("cms_state").setValue([{
                            id: stateId,
                            name: cityResult["_cms_state_value@OData.Community.Display.V1.FormattedValue"],
                            entityType: "cms_state"
                        }]);

                        // 🔹 Get Country from State
                        Xrm.WebApi.retrieveRecord(
                            "cms_state",
                            stateId,
                            "?$select=_cms_country_value"
                        ).then(
                            function (stateResult) {
                                try {
                                    if (!stateResult._cms_country_value) return;

                                    var countryId = stateResult._cms_country_value;

                                    // Set Country
                                    formContext.getAttribute("cms_country").setValue([{
                                        id: countryId,
                                        name: stateResult["_cms_country_value@OData.Community.Display.V1.FormattedValue"],
                                        entityType: "cms_country"
                                    }]);

                                    // Lock after auto-fill
                                    formContext.getControl("cms_state").setDisabled(true);
                                    formContext.getControl("cms_country").setDisabled(true);

                                } catch (e) {
                                    console.error("State → Country error:", e.message);
                                    onerror(e, formContext);
                                }
                            },
                            function (error) {
                                console.error("State retrieve failed:", error.message);
                                onerror(error, formContext);
                            }
                        );

                    } catch (e) {
                        console.error("City → State error:", e.message);
                        onerror(e, formContext);
                    }
                },
                function (error) {
                    console.error("City retrieve failed:", error.message);
                    onerror(error, formContext);
                }
            );

        } catch (e) {
            console.error("onCityChange error:", e.message);
            onerror(e, formContext);
        }
    }
};
