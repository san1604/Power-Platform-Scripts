function setAccountFromOpportunity(executionContext) {
    var formContext = executionContext.getFormContext();

    var opportunityAttr = formContext.getAttribute("cms_opportunity");
    var accountAttr = formContext.getAttribute("cms_account");

    if (!opportunityAttr || !accountAttr) return;

    var oppValue = opportunityAttr.getValue();
    if (!oppValue) {
        accountAttr.setValue(null);
        formContext.getControl("cms_account").setDisabled(false);
        return;
    }

    var opportunityId = oppValue[0].id.replace("{", "").replace("}", "");
    var oppEntityName = oppValue[0].entityType;

    Xrm.WebApi.retrieveRecord(
        oppEntityName,
        opportunityId,
        "?$select=_cms_account_value" // 🔥 KEY FIX
    ).then(
        function (result) {
            if (result._cms_account_value) {
                accountAttr.setValue([{
                    id: result._cms_account_value,
                    name: result["_cms_account_value@OData.Community.Display.V1.FormattedValue"],
                    entityType: "account"
                }]);

                formContext.getControl("cms_account").setDisabled(true);
            }
        },
        function (error) {
            console.error(error.message);
        }
    );
}
