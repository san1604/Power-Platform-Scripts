var AccountContactHandler = {

    // 1️⃣ Autofill Account ONLY if Account is empty
    autofillAccountFromContact: function (executionContext) {
        var formContext = executionContext.getFormContext();

        var contactAttr = formContext.getAttribute("cms_contactid");
        var accountAttr = formContext.getAttribute("cms_accountid");

        if (!contactAttr || !accountAttr) return;

        var contactValue = contactAttr.getValue();
        if (!contactValue) return;

        // 🛑 DO NOT override if Account already selected
        if (accountAttr.getValue()) return;

        var contactId = contactValue[0].id.replace(/[{}]/g, "");

        Xrm.WebApi.retrieveRecord(
            "contact",
            contactId,
            "?$select=_parentcustomerid_value"
        ).then(
            function (result) {
                if (!result._parentcustomerid_value) return;

                var accountLookup = [{
                    id: result._parentcustomerid_value,
                    name: result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"],
                    entityType: "account"
                }];

                accountAttr.setValue(accountLookup);
            },
            function (error) {
                console.log("Account autofill failed:", error.message);
            }
        );
    },

    // 2️⃣ Filter Contacts based on Account
    filterContactsByAccount: function (executionContext) {
        var formContext = executionContext.getFormContext();

        var accountAttr = formContext.getAttribute("cms_accountid");
        var contactAttr = formContext.getAttribute("cms_contactid");
        var contactControl = formContext.getControl("cms_contactid");

        if (!accountAttr || !contactAttr || !contactControl) return;

        contactControl.addPreSearch(function () {
            var accountValue = accountAttr.getValue();
            if (!accountValue) return;

            var accountId = accountValue[0].id.replace(/[{}]/g, "");

            var filter =
                "<filter type='and'>" +
                    "<condition attribute='parentcustomerid' operator='eq' value='" + accountId + "' />" +
                "</filter>";

            contactControl.addCustomFilter(filter, "contact");
        });
    }
};
