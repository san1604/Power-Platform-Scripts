function qualifyLead(primaryControl)  {
    var formContext = primaryControl;

    // Read fields from Lead table
    var topic = formContext.getAttribute("cms_name")?.getValue();
    // var email = formContext.getAttribute("cms_email")?.getValue();
    // var company = formContext.getAttribute("cms_company")?.getValue();

    // Build Opportunity record
    var opp = {
        "cms_Name": topic,
        "cms_leadId@odata.bind":
            "/cms_lead(" + formContext.data.entity.getId().replace(/[{}]/g, "") + ")"
    };

    Xrm.WebApi.createRecord("cms_opportunity", opp).then(
        function success(result) {
            Xrm.Navigation.openAlertDialog({ text: "Lead Successfully Qualified!" });

         // Update Lead status
            var statusAttr = formContext.getAttribute("cms_status");
            if (statusAttr) {
                statusAttr.setValue("Qualified");
            }

            formContext.data.entity.save();
        },
        function (error) {
            Xrm.Navigation.openErrorDialog({ message: error.message });
        }
    );
}
